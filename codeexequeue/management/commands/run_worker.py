from django.core.management.base import BaseCommand
from codeexequeue.models import CodeQueue
from django.db import transaction
import time
import requests


JUDGE_BASE_URL = "https://codespherejudge-1.onrender.com"
RUN_URL = f"{JUDGE_BASE_URL}/run"

MAX_WARMUP_SECONDS = 140
PING_INTERVAL = 10
MAX_RETRIES = 3

#this function wake the execution service which is deployed in render it take 50 sec to cold start thats why this function is important but in paid this function is skip
def wait_for_judge_service(max_wait=140):
    start = time.time()

    dummy_payload = {"code": "print('warmup')"}

    while time.time() - start < max_wait:
        try:
            r = requests.post(
                RUN_URL,
                json=dummy_payload,
            )

            

            if r.status_code <= 500:
                return True

        except requests.RequestException:
            pass

        time.sleep(5)

    return False



class Command(BaseCommand):
    help = "Run code execution worker"

    #main idea is the  worker watch the database and see the pending job and get the job and make request to code execution service to execute code if code executed successfully then change status to complete if their is failure retry 2 more times this leads to asynchronous execution and use polling to see result 

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Worker started"))

        while True:
            pending_job = (
                CodeQueue.objects
                .filter(status="pending")
                .order_by("created_at")
                .first()
            )

            if not pending_job:
                time.sleep(2)
                continue

            if not wait_for_judge_service():
                time.sleep(5)
                continue

            with transaction.atomic():
                pending_job.refresh_from_db()
                if pending_job.status != "pending":
                    continue

                pending_job.status = "running"
                pending_job.attempts += 1
                pending_job.save()

            try:
                res = requests.post(
                    RUN_URL,
                    json={"code": pending_job.code},
                    timeout=90
                )

                if not res.headers.get("content-type", "").startswith("application/json"):
                    pending_job.status = "failed"
                    pending_job.error = f"Non-JSON response: {res.text[:300]}"
                    pending_job.save()
                    continue

                pending_job.output = res.json()
                pending_job.status = "completed"
                pending_job.save()

            except requests.RequestException as e:
                # maximum 3 times retry is allowed in future we can change this but now take only 2 more time try
                if pending_job.attempts >= MAX_RETRIES:
                    pending_job.status = "failed"
                else:
                    pending_job.status = "pending"

                pending_job.error = str(e)
                pending_job.save()

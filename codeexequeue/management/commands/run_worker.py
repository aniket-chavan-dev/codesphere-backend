from django.core.management.base import BaseCommand
from codeexequeue.models import CodeQueue
from django.db import transaction
import time
import requests


JUDGE_BASE_URL = "https://codespherejudge-1.onrender.com"
RUN_URL = f"{JUDGE_BASE_URL}/run"


def wait_for_judge_service():
   
    while True:
        try:
            r = requests.get(JUDGE_BASE_URL, timeout=20)
            if r.status_code == 200:
                return
        except requests.RequestException:
            pass
        time.sleep(10)


class Command(BaseCommand):
    help = "Run code execution worker"

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

            with transaction.atomic():
                pending_job.status = "running"
                pending_job.save()

            
            wait_for_judge_service()

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
                pending_job.status = "failed"
                pending_job.error = str(e)
                pending_job.save()

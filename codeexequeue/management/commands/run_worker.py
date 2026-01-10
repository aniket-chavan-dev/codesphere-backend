from django.core.management.base import BaseCommand
from django.db import transaction
from codeexequeue.models import CodeQueue
import time
import requests



JUDGE_BASE_URL = "https://codespherejudge-1.onrender.com"
RUN_URL = f"{JUDGE_BASE_URL}/run"
HEALTH_URL = f"{JUDGE_BASE_URL}/health"

MAX_WARMUP_SECONDS = 140
PING_INTERVAL = 5
MAX_RETRIES = 3
REQUEST_TIMEOUT = 90




def is_json_response(response):
    return response.headers.get("content-type", "").startswith("application/json")

#this function wake the execution service which is deployed in render it take 50 sec to cold start thats why this function is important but in paid this function is skip
def wait_for_judge_service(max_wait=MAX_WARMUP_SECONDS):
   
    start = time.time()

    while time.time() - start < max_wait:
        try:
            res = requests.get(HEALTH_URL, timeout=5)

            if res.status_code == 200 and is_json_response(res):
                return True

        except requests.RequestException:
            pass

        time.sleep(PING_INTERVAL)

    return False



class Command(BaseCommand):
    help = "Run code execution worker"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🚀 Code execution worker started"))

        while True:
          
            job = (
                CodeQueue.objects
                .filter(status="pending")
                .order_by("created_at")
                .first()
            )

            if not job:
                time.sleep(2)
                continue

           
            if not wait_for_judge_service():
              
                time.sleep(5)
                continue

           
            with transaction.atomic():
                job.refresh_from_db()

                if job.status != "pending":
                    continue

                job.status = "running"
                job.attempts += 1
                job.save()

         
            try:
                res = requests.post(
                    RUN_URL,
                    json={"code": job.code},
                    timeout=REQUEST_TIMEOUT
                )

            
                if not is_json_response(res):
                    job.status = "pending"
                    job.error = "Judge warming up, retrying..."
                    job.save()
                    continue

               
                job.output = res.json()
                job.status = "completed"
                job.error = ""
                job.save()

           
            except requests.RequestException as e:
                if job.attempts >= MAX_RETRIES:
                    job.status = "failed"
                    job.error = f"Execution failed after retries: {str(e)}"
                else:
                    job.status = "pending"
                    job.error = f"Retrying due to error: {str(e)}"

                job.save()

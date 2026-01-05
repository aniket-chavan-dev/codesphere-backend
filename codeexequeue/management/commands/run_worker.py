from django.core.management.base import BaseCommand
from codeexequeue.models import CodeQueue
from django.db import transaction
import time
import requests
from json import JSONDecodeError
import json

class Command(BaseCommand):
    help = 'Run the code execution worker to process code execution jobs.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting code execution worker...and started in render'))
        while True:
            pending_job = CodeQueue.objects.filter(status='pending').order_by('created_at').first()
            
            if pending_job is None :
                time.sleep(2)
                continue

            with transaction.atomic():
                pending_job.status = "running"
                pending_job.save()

            code = pending_job.code

            url = "https://codespherejudge-1.onrender.com/run/"
            data = {
                'code' : code
            }
            try:
                res = requests.post(url=url, data=json.dumps(data))
                try:
                    result_json = res.json()
                except JSONDecodeError:
                    pending_job.error = 'Invalid JSON response from microservice'
                    pending_job.status = 'failed'
                    pending_job.save()

                pending_job.output = result_json
                pending_job.status = 'completed'
                pending_job.save()
            except requests.exceptions.RequestException as e:
                pending_job.error = 'Invalid JSON response from microservice'
                pending_job.status = 'failed'
                pending_job.save()

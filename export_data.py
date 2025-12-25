import json
from django.core.serializers import serialize
import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")  # Replace 'backend' with your project folder name
django.setup()

from problems.models import *

# Serialize all data
data = serialize("json", Problems.objects.all())



# Save as UTF-8
with open("data.json", "w", encoding="utf-8") as f:
    f.write(data)

print("Exported data.json successfully!")

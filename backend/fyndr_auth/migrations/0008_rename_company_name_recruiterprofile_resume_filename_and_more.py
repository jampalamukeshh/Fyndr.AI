"""
Minimal placeholder migration to satisfy dependency chain.
This file was added because 0009 referenced 0008 which was missing in the repo.
It intentionally performs no operations and depends on 0007.
"""
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("fyndr_auth", "0007_alter_oauthtoken_provider"),
    ]

    operations = []


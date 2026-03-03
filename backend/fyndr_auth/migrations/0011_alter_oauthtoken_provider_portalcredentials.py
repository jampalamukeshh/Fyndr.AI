"""
Migration that alters the OAuthToken `provider` field choices.
PortalCredentials is created in 0005_portalcredentials, so do not recreate it here.
"""
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("fyndr_auth", "0010_merge_0006_oauthtoken_0009_oauthtoken"),
    ]

    operations = [
        migrations.AlterField(
            model_name="oauthtoken",
            name="provider",
            field=models.CharField(choices=[("google", "Google")], max_length=50),
        ),
    ]

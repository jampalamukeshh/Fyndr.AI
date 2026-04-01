"""
Repair migration: recreate jobapplier_application table if it was accidentally
dropped by migration 0005 on already-deployed databases.
"""

from django.db import migrations


CREATE_SQL = """
CREATE TABLE IF NOT EXISTS "jobapplier_application" (
    "id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "status"                    VARCHAR(20)  NOT NULL DEFAULT 'pending',
    "application_method"        VARCHAR(20)  NOT NULL DEFAULT 'manual',
    "external_application_id"   VARCHAR(500),
    "application_url"           VARCHAR(200),
    "resume_text"               TEXT         NOT NULL DEFAULT '',
    "cover_letter_text"         TEXT         NOT NULL DEFAULT '',
    "custom_answers"            JSONB        NOT NULL DEFAULT '{}',
    "automation_log"            JSONB        NOT NULL DEFAULT '[]',
    "ats_response"              JSONB        NOT NULL DEFAULT '{}',
    "notes"                     TEXT         NOT NULL DEFAULT '',
    "is_verified"               BOOLEAN      NOT NULL DEFAULT FALSE,
    "verified_at"               TIMESTAMPTZ,
    "verified_source"           VARCHAR(50)  NOT NULL DEFAULT '',
    "email_confirmed"           BOOLEAN      NOT NULL DEFAULT FALSE,
    "email_confirmed_at"        TIMESTAMPTZ,
    "is_tracking_enabled"       BOOLEAN      NOT NULL DEFAULT TRUE,
    "last_status_check"         TIMESTAMPTZ,
    "status_updates"            JSONB        NOT NULL DEFAULT '[]',
    "applied_at"                TIMESTAMPTZ  NOT NULL,
    "created_at"                TIMESTAMPTZ  NOT NULL,
    "updated_at"                TIMESTAMPTZ  NOT NULL,
    "user_id"                   INTEGER      NOT NULL
        REFERENCES "fyndr_auth_user"("id") ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
    "job_id"                    INTEGER      NOT NULL
        REFERENCES "jobscraper_jobposting"("id") ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
    UNIQUE ("user_id", "job_id")
);
"""

CREATE_SQL_SQLITE = """
CREATE TABLE IF NOT EXISTS "jobapplier_application" (
    "id"                        TEXT         PRIMARY KEY,
    "status"                    VARCHAR(20)  NOT NULL DEFAULT 'pending',
    "application_method"        VARCHAR(20)  NOT NULL DEFAULT 'manual',
    "external_application_id"   VARCHAR(500),
    "application_url"           VARCHAR(200),
    "resume_text"               TEXT         NOT NULL DEFAULT '',
    "cover_letter_text"         TEXT         NOT NULL DEFAULT '',
    "custom_answers"            TEXT         NOT NULL DEFAULT '{}',
    "automation_log"            TEXT         NOT NULL DEFAULT '[]',
    "ats_response"              TEXT         NOT NULL DEFAULT '{}',
    "notes"                     TEXT         NOT NULL DEFAULT '',
    "is_verified"               BOOL         NOT NULL DEFAULT 0,
    "verified_at"               DATETIME,
    "verified_source"           VARCHAR(50)  NOT NULL DEFAULT '',
    "email_confirmed"           BOOL         NOT NULL DEFAULT 0,
    "email_confirmed_at"        DATETIME,
    "is_tracking_enabled"       BOOL         NOT NULL DEFAULT 1,
    "last_status_check"         DATETIME,
    "status_updates"            TEXT         NOT NULL DEFAULT '[]',
    "applied_at"                DATETIME     NOT NULL,
    "created_at"                DATETIME     NOT NULL,
    "updated_at"                DATETIME     NOT NULL,
    "user_id"                   INTEGER      NOT NULL
        REFERENCES "fyndr_auth_user"("id") DEFERRABLE INITIALLY DEFERRED,
    "job_id"                    INTEGER      NOT NULL
        REFERENCES "jobscraper_jobposting"("id") DEFERRABLE INITIALLY DEFERRED,
    UNIQUE ("user_id", "job_id")
);
"""


def repair_application_table(apps, schema_editor):
    """Recreate jobapplier_application only if it does not already exist."""
    vendor = schema_editor.connection.vendor
    with schema_editor.connection.cursor() as cursor:
        if vendor == "postgresql":
            # Quick existence check
            cursor.execute(
                "SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='jobapplier_application'"
            )
            if cursor.fetchone():
                return  # already exists – nothing to do
            cursor.execute(CREATE_SQL)
        else:
            # SQLite: CREATE TABLE IF NOT EXISTS handles the check
            cursor.execute(CREATE_SQL_SQLITE)


class Migration(migrations.Migration):

    dependencies = [
        ("jobapplier", "0007_remove_applicationstatushistory_application_and_more"),
    ]

    operations = [
        migrations.RunPython(repair_application_table, migrations.RunPython.noop),
    ]

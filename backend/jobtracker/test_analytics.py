import pytest
from django.contrib.auth import get_user_model

from fyndr_auth.models import JobSeekerProfile
from jobscraper.models import JobPosting
from jobapplier.models import JobApplication
from jobtracker.analytics import ApplicationAnalytics


@pytest.mark.django_db
def test_application_counts_uses_jobapplication_model():
    user_model = get_user_model()
    user = user_model.objects.create_user(
        username="analytics_user",
        email="analytics_user@example.com",
        password="test-pass-123",
        role="job_seeker",
    )
    profile = JobSeekerProfile.objects.create(user=user)

    job = JobPosting.objects.create(
        external_id="analytics-job-1",
        title="Backend Engineer",
        company="Acme",
        source="greenhouse",
        url="https://example.com/jobs/analytics-1",
        is_active=True,
    )

    JobApplication.objects.create(
        user=user,
        job=job,
        status=JobApplication.ApplicationStatus.APPLIED,
    )

    analytics = ApplicationAnalytics()
    result = analytics.get_application_counts(profile, "30d")

    assert result["total_applications"] == 1
    assert result["counts"]["applied"] == 1


@pytest.mark.django_db
def test_application_timeline_count_field_is_valid():
    user_model = get_user_model()
    user = user_model.objects.create_user(
        username="timeline_user",
        email="timeline_user@example.com",
        password="test-pass-123",
        role="job_seeker",
    )
    profile = JobSeekerProfile.objects.create(user=user)

    job = JobPosting.objects.create(
        external_id="analytics-job-2",
        title="Platform Engineer",
        company="Nova",
        source="lever",
        url="https://example.com/jobs/analytics-2",
        is_active=True,
    )

    JobApplication.objects.create(
        user=user,
        job=job,
        status=JobApplication.ApplicationStatus.INTERVIEW,
    )

    analytics = ApplicationAnalytics()
    result = analytics.get_application_timeline(profile, "30d")

    assert "timeline" in result
    assert len(result["timeline"]) >= 1
    assert result["timeline"][0]["applications"] >= 1

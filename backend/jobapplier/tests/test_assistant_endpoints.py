import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from fyndr_auth.models import JobSeekerProfile
from jobscraper.models import JobPosting


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authed_user(api_client):
    user_model = get_user_model()
    user = user_model.objects.create_user(
        username="assistant_tester",
        email="assistant_tester@example.com",
        password="test-pass-123",
        role="job_seeker",
    )
    JobSeekerProfile.objects.create(
        user=user,
        job_title="Python Developer",
        skills=["python", "django", "rest"],
        preferred_roles=["backend engineer"],
        preferred_locations=["remote"],
        industries=["software"],
    )
    api_client.force_authenticate(user=user)
    return user


@pytest.mark.django_db
def test_semantic_matches_returns_ranked_results(api_client, authed_user):
    JobPosting.objects.create(
        external_id="job-1",
        title="Backend Python Engineer",
        company="Acme",
        source="greenhouse",
        url="https://example.com/jobs/1",
        description="Build Django and REST APIs",
        skills_required=["python", "django"],
        is_active=True,
    )
    JobPosting.objects.create(
        external_id="job-2",
        title="Graphic Designer",
        company="Design Co",
        source="lever",
        url="https://example.com/jobs/2",
        description="Create brand assets and ad banners",
        skills_required=["figma", "illustrator"],
        is_active=True,
    )

    response = api_client.get("/api/applications/semantic-matches/?limit=5")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["count"] >= 1
    assert payload["matches"][0]["title"] == "Backend Python Engineer"


@pytest.mark.django_db
def test_assistant_chat_returns_structured_action(api_client, authed_user):
    JobPosting.objects.create(
        external_id="job-3",
        title="Python Platform Engineer",
        company="Nova",
        source="greenhouse",
        url="https://example.com/jobs/3",
        description="Python services and backend systems",
        skills_required=["python", "backend"],
        is_active=True,
    )

    response = api_client.post(
        "/api/applications/assistant/chat/",
        {"message": "find jobs for me", "limit": 3},
        format="json",
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["assistant"]["action"]["type"] == "list_jobs"
    assert isinstance(payload["matches"], list)


@pytest.mark.django_db
def test_assistant_action_preview_rejects_invalid_type(api_client, authed_user):
    response = api_client.post(
        "/api/applications/assistant/action-preview/",
        {"type": "drop_database", "payload": {}},
        format="json",
    )

    assert response.status_code == 400
    payload = response.json()
    assert payload["success"] is False

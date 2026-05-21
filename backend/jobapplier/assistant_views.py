from __future__ import annotations

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from fyndr_auth.models import JobSeekerProfile
from jobscraper.models import JobPosting

from .ai_orchestration import SemanticJobMatcher, ActionableCareerAssistant


matcher = SemanticJobMatcher()
assistant = ActionableCareerAssistant()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def semantic_matches(request):
    """Return semantic-ranked jobs for the current job seeker."""
    try:
        profile = get_object_or_404(JobSeekerProfile, user=request.user)
        limit = int(request.GET.get("limit", 15))

        jobs = list(JobPosting.objects.filter(is_active=True).order_by("-date_scraped")[:500])
        ranked = matcher.rank_jobs(profile, jobs, limit=limit)

        return Response(
            {
                "success": True,
                "count": len(ranked),
                "matches": [item.to_dict() for item in ranked],
            }
        )
    except Exception as error:
        return Response(
            {
                "success": False,
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assistant_chat(request):
    """Action-capable assistant response with structured frontend action payload."""
    try:
        profile = get_object_or_404(JobSeekerProfile, user=request.user)
        message = request.data.get("message", "")
        limit = int(request.data.get("limit", 5))

        jobs = list(JobPosting.objects.filter(is_active=True).order_by("-date_scraped")[:300])
        ranked = matcher.rank_jobs(profile, jobs, limit=limit)
        job_payloads = [item.to_dict() for item in ranked]

        reply = assistant.suggest_action(message=message, jobs=job_payloads)

        return Response(
            {
                "success": True,
                "message": message,
                "matches": job_payloads,
                "assistant": reply,
            }
        )
    except Exception as error:
        return Response(
            {
                "success": False,
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assistant_action_preview(request):
    """Validate and preview an assistant action before frontend executes it."""
    try:
        action_type = request.data.get("type")
        payload = request.data.get("payload") or {}

        allowed_actions = {
            "list_jobs",
            "open_job",
            "start_quick_apply",
            "navigate",
            "none",
        }

        if action_type not in allowed_actions:
            return Response(
                {
                    "success": False,
                    "error": "Unsupported action type",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "approved": action_type != "none",
                "action": {
                    "type": action_type,
                    "payload": payload,
                },
            }
        )
    except Exception as error:
        return Response(
            {
                "success": False,
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

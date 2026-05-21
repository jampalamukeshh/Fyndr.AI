"""
AI orchestration primitives for semantic matching and action-capable assistant flows.

This module intentionally keeps dependencies optional. If LangChain/LangGraph are not
installed, the service falls back to deterministic rule-based behavior.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any
import math
import re

from jobscraper.models import JobPosting

try:
    from langchain_core.messages import HumanMessage, SystemMessage  # type: ignore
except Exception:  # pragma: no cover
    HumanMessage = None
    SystemMessage = None


TOKEN_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9_\-+.#]{1,}")


def _normalize_tokens(parts: list[str]) -> set[str]:
    tokens: set[str] = set()
    for part in parts:
        if not part:
            continue
        for token in TOKEN_RE.findall(str(part).lower()):
            if len(token) > 1:
                tokens.add(token)
    return tokens


def _cosine_binary_similarity(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    overlap = len(a.intersection(b))
    return overlap / math.sqrt(len(a) * len(b))


@dataclass
class RankedJob:
    job: JobPosting
    score: float
    reasons: list[str]

    def to_dict(self) -> dict[str, Any]:
        return {
            "job_id": self.job.id,
            "title": self.job.title,
            "company": self.job.company,
            "location": self.job.location,
            "source": self.job.source,
            "url": self.job.url,
            "score": round(self.score * 100, 2),
            "reasons": self.reasons,
        }


class SemanticJobMatcher:
    """Semantic-ish matcher using token overlap for safe local fallback behavior."""

    def profile_tokens(self, profile: Any) -> set[str]:
        return _normalize_tokens(
            [
                getattr(profile, "job_title", ""),
                " ".join(getattr(profile, "skills", []) or []),
                " ".join(getattr(profile, "preferred_roles", []) or []),
                " ".join(getattr(profile, "industries", []) or []),
                " ".join(getattr(profile, "preferred_locations", []) or []),
            ]
        )

    def job_tokens(self, job: JobPosting) -> set[str]:
        return _normalize_tokens(
            [
                job.title,
                job.company,
                job.location or "",
                job.description or "",
                " ".join(job.skills_required or []),
                " ".join(job.skills_preferred or []),
                " ".join(job.tools_technologies or []),
                job.industry or "",
                job.experience_level or "",
            ]
        )

    def rank_jobs(self, profile: Any, jobs: list[JobPosting], limit: int = 15) -> list[RankedJob]:
        p_tokens = self.profile_tokens(profile)
        ranked: list[RankedJob] = []

        for job in jobs:
            j_tokens = self.job_tokens(job)
            score = _cosine_binary_similarity(p_tokens, j_tokens)
            if score <= 0:
                continue

            overlap = sorted(p_tokens.intersection(j_tokens))[:5]
            reasons = [
                f"Matched terms: {', '.join(overlap)}" if overlap else "Profile-to-job semantic overlap detected",
                f"Source: {job.source}",
            ]
            ranked.append(RankedJob(job=job, score=score, reasons=reasons))

        ranked.sort(key=lambda item: item.score, reverse=True)
        return ranked[: max(1, limit)]


class ActionableCareerAssistant:
    """Assistant that returns structured actions for frontend execution."""

    def _detect_intent(self, message: str) -> str:
        text = (message or "").lower()
        if any(word in text for word in ["find", "search", "show jobs", "list jobs"]):
            return "list_jobs"
        if any(word in text for word in ["open", "view", "details", "job page"]):
            return "open_job"
        if any(word in text for word in ["apply", "quick apply", "submit"]):
            return "start_quick_apply"
        if any(word in text for word in ["profile", "update profile", "resume"]):
            return "navigate_profile"
        return "assist"

    def suggest_action(self, message: str, jobs: list[dict[str, Any]]) -> dict[str, Any]:
        intent = self._detect_intent(message)

        if intent == "list_jobs":
            return {
                "intent": intent,
                "assistant_reply": "I found matching jobs. I can open any of them for you.",
                "action": {
                    "type": "list_jobs",
                    "payload": {"jobs": jobs},
                },
            }

        if intent == "open_job":
            top = jobs[0] if jobs else None
            if top:
                return {
                    "intent": intent,
                    "assistant_reply": f"Opening the top match: {top['title']} at {top['company']}",
                    "action": {
                        "type": "open_job",
                        "payload": {"job_id": top["job_id"], "url": top.get("url")},
                    },
                }
            return {
                "intent": intent,
                "assistant_reply": "I could not find a matching job to open yet.",
                "action": {"type": "none", "payload": {}},
            }

        if intent == "start_quick_apply":
            top = jobs[0] if jobs else None
            if top:
                return {
                    "intent": intent,
                    "assistant_reply": "I prepared a quick-apply action for your top match.",
                    "action": {
                        "type": "start_quick_apply",
                        "payload": {"job_id": top["job_id"]},
                    },
                }
            return {
                "intent": intent,
                "assistant_reply": "Please ask me to find jobs first so I can prepare quick apply.",
                "action": {"type": "none", "payload": {}},
            }

        if intent == "navigate_profile":
            return {
                "intent": intent,
                "assistant_reply": "I can take you to profile management to update resume and preferences.",
                "action": {
                    "type": "navigate",
                    "payload": {"path": "/profile-management"},
                },
            }

        return {
            "intent": "assist",
            "assistant_reply": "Tell me what to do: find jobs, open a job, or start quick apply.",
            "action": {"type": "none", "payload": {}},
        }

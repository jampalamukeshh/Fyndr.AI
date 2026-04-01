"""
Management command: seed_matching_jobs

Seeds realistic software / AI / ML / backend / frontend job postings that align
with typical job-seeker profiles on the platform (Python, ML, AI, Django, React,
LangChain, etc.).  Also optionally scrapes live Greenhouse / Lever boards from
popular Indian-market tech companies.

Usage:
    python manage.py seed_matching_jobs            # seed static + live scrape
    python manage.py seed_matching_jobs --static-only   # only static seed data
    python manage.py seed_matching_jobs --live-only     # only live scrape
    python manage.py seed_matching_jobs --clear     # delete seeded jobs first
"""

import hashlib
import logging
import time
from typing import Any, Dict, List

import requests
from django.core.management.base import BaseCommand
from django.utils import timezone

from jobscraper.models import JobPosting

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Static seed data – realistic, varied software / AI / ML roles for India
# ---------------------------------------------------------------------------

SEED_COMPANIES = [
    ("Razorpay",    "https://razorpay.com/jobs/"),
    ("Zepto",       "https://www.zepto.team/careers"),
    ("Swiggy",      "https://careers.swiggy.com/#/"),
    ("Meesho",      "https://meesho.io/jobs"),
    ("CRED",        "https://careers.cred.club/"),
    ("Groww",       "https://groww.in/careers"),
    ("PhonePe",     "https://careers.phonepe.com/"),
    ("Freshworks",  "https://careers.freshworks.com/"),
    ("Postman",     "https://www.postman.com/careers/"),
    ("Hasura",      "https://hasura.io/careers/"),
    ("Sarvam AI",   "https://jobs.gem.com/sarvam"),
    ("Krutrim",     "https://krutrim.com/careers"),
    ("Ola Electric","https://olaelectric.com/careers"),
    ("Jupiter",     "https://jupiter.money/careers/"),
    ("Slice",       "https://sliceit.com/careers"),
    ("BrowserStack","https://www.browserstack.com/careers"),
    ("Lenskart",    "https://careers.lenskart.com/"),
    ("Sprinklr",    "https://www.sprinklr.com/careers/"),
    ("Zenoti",      "https://www.zenoti.com/company/careers/"),
    ("Darwinbox",   "https://darwinbox.com/careers"),
]

SEED_ROLES: List[Dict[str, Any]] = [
    # ------- AI / ML -------
    {
        "title": "AI/ML Engineer",
        "skills_required": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLflow"],
        "description": (
            "Design, build and deploy machine-learning models and AI pipelines. You will work on "
            "recommendation engines, NLP systems and computer-vision modules. Experience with "
            "LangChain or LlamaIndex is a plus."
        ),
        "requirements": "2+ years of hands-on ML model development, strong Python, statistics fundamentals.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    {
        "title": "AI/ML Intern",
        "skills_required": ["Python", "NumPy", "Pandas", "Scikit-learn", "Jupyter"],
        "description": (
            "6-month internship on our AI Platform team. Work alongside senior ML engineers on "
            "data preprocessing, feature engineering, model training and evaluation pipelines. "
            "LangChain / agentic-AI exposure is a strong plus."
        ),
        "requirements": "Pursuing B.Tech / M.Tech. Solid Python fundamentals, keen interest in AI/ML.",
        "experience_level": "intern",
        "job_type": "internship",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    {
        "title": "Machine Learning Engineer",
        "skills_required": ["Python", "PyTorch", "Spark", "Docker", "Kubernetes"],
        "description": (
            "Build production ML systems that serve millions of daily active users. Own the "
            "full MLOps lifecycle: data ingestion → experimentation → model registry → serving."
        ),
        "requirements": "3+ years ML engineering, experience with model serving (TorchServe / Triton), distributed training.",
        "experience_level": "senior",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Hyderabad, India",
    },
    {
        "title": "Data Scientist",
        "skills_required": ["Python", "SQL", "Pandas", "Scikit-learn", "Tableau"],
        "description": (
            "Translate business problems into analytical frameworks. Run hypothesis tests, build "
            "predictive models and communicate insights to stakeholders via dashboards and reports."
        ),
        "requirements": "2+ years data science, strong SQL & Python, experience with A/B testing.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "onsite",
        "location": "Mumbai, India",
    },
    {
        "title": "NLP Engineer",
        "skills_required": ["Python", "HuggingFace", "LangChain", "spaCy", "BERT"],
        "description": (
            "Develop NLP models for entity recognition, intent classification and generative "
            "chat features. Fine-tune LLMs on domain-specific corpora, build retrieval-augmented "
            "generation (RAG) pipelines."
        ),
        "requirements": "2+ years NLP engineering, familiarity with LLMs & RAG architectures.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "remote",
        "location": "Remote, India",
    },
    {
        "title": "Agentic AI Developer",
        "skills_required": ["Python", "LangChain", "OpenAI", "FastAPI", "Redis"],
        "description": (
            "Build autonomous AI agents that can browse the web, call external APIs, write code "
            "and plan multi-step tasks. Implement tool-use, memory and reflection loops using "
            "LangChain / LangGraph or AutoGen frameworks."
        ),
        "requirements": "Experience building LLM-powered agents, strong Python, REST API integration.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "remote",
        "location": "Remote, India",
    },
    {
        "title": "Generative AI Engineer",
        "skills_required": ["Python", "LangChain", "OpenAI", "Vector DBs", "Prompt Engineering"],
        "description": (
            "Integrate large language models into product features: chatbots, code assistants, "
            "document summarizers. Build RAG pipelines with Pinecone / Weaviate and fine-tune "
            "open-source models."
        ),
        "requirements": "1+ years GenAI product work, hands-on experience with LangChain or similar.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    # ------- Backend -------
    {
        "title": "Backend Developer – Python / Django",
        "skills_required": ["Python", "Django", "DRF", "PostgreSQL", "Redis"],
        "description": (
            "Build and maintain high-performance REST APIs powering our fintech platform. "
            "Own services end-to-end: schema design, API contracts, async workers and caching."
        ),
        "requirements": "2+ years Django / DRF, understanding of async (Celery), good SQL skills.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    {
        "title": "Python Backend Engineer",
        "skills_required": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
        "description": (
            "Develop microservices in Python/FastAPI, containerize with Docker, deploy on AWS. "
            "Collaborate with data and ML teams to expose model inference APIs."
        ),
        "requirements": "2+ years Python backend, Docker, basic cloud (AWS/GCP).",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Pune, India",
    },
    {
        "title": "Backend Engineer (Python) – Intern",
        "skills_required": ["Python", "Django", "REST APIs", "SQL"],
        "description": (
            "6-month internship on the backend platform team. Implement new API endpoints, "
            "write unit tests and participate in code reviews."
        ),
        "requirements": "Pursuing B.Tech / M.Tech, Python basics, understanding of REST.",
        "experience_level": "intern",
        "job_type": "internship",
        "employment_mode": "onsite",
        "location": "Chennai, India",
    },
    {
        "title": "Software Engineer – Backend",
        "skills_required": ["Java", "Spring Boot", "SQL", "Microservices", "Kafka"],
        "description": (
            "Build scalable microservices for our payments infrastructure. Ensure high availability, "
            "low latency and observability with Prometheus / Grafana."
        ),
        "requirements": "2+ years Java backend, microservices architecture, SQL, message queues.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    # ------- Full-stack / Frontend -------
    {
        "title": "Full Stack Developer – React & Django",
        "skills_required": ["React", "JavaScript", "Python", "Django", "PostgreSQL"],
        "description": (
            "Own features from database schema to pixel-perfect UI. Work with product managers "
            "to ship experiments rapidly using our React + Django stack."
        ),
        "requirements": "2+ years full-stack, comfortable with both React hooks and Django ORM.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    {
        "title": "Frontend Developer – React",
        "skills_required": ["React", "JavaScript", "TypeScript", "CSS", "REST APIs"],
        "description": (
            "Build beautiful, accessible web UIs. Implement design-system components, write "
            "integration tests and optimise Core Web Vitals."
        ),
        "requirements": "2+ years React, TypeScript preferred, eye for design.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Hyderabad, India",
    },
    {
        "title": "Frontend Engineer (Angular) – Intern",
        "skills_required": ["Angular", "TypeScript", "JavaScript", "HTML/CSS"],
        "description": (
            "Assist in building and maintaining Angular-based enterprise dashboard features. "
            "Learn component architecture, state management (NgRx) and unit testing with Jasmine."
        ),
        "requirements": "Pursuing B.Tech, familiarity with Angular basics, TypeScript.",
        "experience_level": "intern",
        "job_type": "internship",
        "employment_mode": "onsite",
        "location": "Noida, India",
    },
    # ------- Automation / Testing -------
    {
        "title": "Automation Framework Developer",
        "skills_required": ["Python", "Selenium", "PyTest", "CI/CD", "Jenkins"],
        "description": (
            "Design and maintain end-to-end test automation frameworks and CI pipelines. "
            "Drive shift-left testing by embedding quality gates into every deployment stage."
        ),
        "requirements": "2+ years test automation (Selenium/Playwright), Python, Jenkins or GitHub Actions.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    {
        "title": "QA Automation Engineer",
        "skills_required": ["Python", "Selenium", "Appium", "REST Assured", "API Testing"],
        "description": (
            "Write automated test suites for web and mobile apps. Integrate tests into CI/CD, "
            "report defects and work closely with developers to maintain high quality."
        ),
        "requirements": "2+ years QA automation, Selenium / Appium, API testing experience.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "onsite",
        "location": "Pune, India",
    },
    # ------- Data Engineering -------
    {
        "title": "Data Engineer",
        "skills_required": ["Python", "SQL", "Apache Spark", "Airflow", "AWS Glue"],
        "description": (
            "Build and operate data pipelines that move billions of events per day. Design "
            "warehouse schemas, optimise query performance and ensure data quality."
        ),
        "requirements": "2+ years data engineering, Spark / Airflow, strong SQL.",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    # ------- DevOps / SRE -------
    {
        "title": "DevOps Engineer",
        "skills_required": ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "AWS"],
        "description": (
            "Manage cloud infrastructure on AWS, maintain Kubernetes clusters, build GitOps "
            "delivery pipelines and respond to production incidents."
        ),
        "requirements": "2+ years DevOps / infra, Kubernetes, IaC (Terraform / Pulumi).",
        "experience_level": "mid",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    # ------- Product / Platform -------
    {
        "title": "Software Development Engineer – Platform",
        "skills_required": ["Python", "Go", "Kubernetes", "gRPC", "Observability"],
        "description": (
            "Improve developer experience by building internal platform tooling: self-service "
            "infra provisioning, internal CLI, observability dashboards."
        ),
        "requirements": "3+ years SWE, experience building platform / infra products.",
        "experience_level": "senior",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    {
        "title": "SDE-1 – Backend",
        "skills_required": ["Python", "SQL", "REST APIs", "Git"],
        "description": (
            "Entry-level software engineering role on our consumer app team. Ship features, "
            "write tests, participate in on-call rotation and grow fast."
        ),
        "requirements": "0-2 years experience or fresh graduate, good DSA foundations, Python or Java.",
        "experience_level": "entry",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
    # ------- Research / Applied Science -------
    {
        "title": "Research Engineer – AI",
        "skills_required": ["Python", "PyTorch", "Academic Paper Reading", "LLMs", "Research"],
        "description": (
            "Conduct applied research to push state-of-the-art on language, vision or multi-modal "
            "models. Publish results internally and externally. Prototype novel architectures."
        ),
        "requirements": "M.Tech / PhD or equivalent research experience, PyTorch, strong ML fundamentals.",
        "experience_level": "senior",
        "job_type": "full-time",
        "employment_mode": "hybrid",
        "location": "Bangalore, India",
    },
]


def _make_id(*parts: str) -> str:
    """Deterministic external_id for seeded jobs."""
    combined = "|".join(parts).lower()
    return "seed_" + hashlib.md5(combined.encode()).hexdigest()[:12]


class Command(BaseCommand):
    help = "Seed software / AI / ML job postings aligned with typical Fyndr.AI job-seeker profiles"

    def add_arguments(self, parser):
        parser.add_argument("--static-only", action="store_true", help="Only insert static seed data, skip live scrape")
        parser.add_argument("--live-only", action="store_true", help="Only run live Greenhouse/Lever scrape, skip static")
        parser.add_argument("--clear", action="store_true", help="Delete previously seeded jobs before re-seeding")

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = JobPosting.objects.filter(source="seed").delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} seeded jobs."))

        total = 0

        if not options["live_only"]:
            total += self._seed_static()

        if not options["static_only"]:
            total += self._scrape_live()

        self.stdout.write(self.style.SUCCESS(f"\nDone. Total new jobs added: {total}"))

    # ------------------------------------------------------------------
    def _seed_static(self) -> int:
        """Create static seed job postings from SEED_ROLES × SEED_COMPANIES."""
        saved = 0
        now = timezone.now()

        company_pool = SEED_COMPANIES.copy()
        company_index = 0

        for role in SEED_ROLES:
            # Rotate through companies so each role gets a different company
            company_name, career_url = company_pool[company_index % len(company_pool)]
            company_index += 1

            # Use the real careers page URL directly — no fake job-specific paths
            apply_url = career_url
            ext_id = _make_id(role["title"], company_name)

            if JobPosting.objects.filter(external_id=ext_id, source="seed").exists():
                continue

            skills = role.get("skills_required", [])
            if isinstance(skills, str):
                skills = [s.strip() for s in skills.split(",") if s.strip()]

            emp_mode = role.get("employment_mode", "hybrid")
            if emp_mode == "onsite":
                emp_mode = "on-site"

            JobPosting.objects.create(
                external_id=ext_id,
                source="seed",
                source_type="scraped",
                title=role["title"],
                company=company_name,
                location=role.get("location", "India"),
                url=apply_url,
                apply_url=apply_url,
                application_mode="redirect",
                description=role.get("description", ""),
                requirements=role.get("requirements", ""),
                skills_required=skills,
                experience_level=role.get("experience_level", "mid"),
                job_type=role.get("job_type", "full-time"),
                employment_mode=emp_mode,
                industry="Technology",
                is_active=True,
                date_scraped=now,
            )
            saved += 1
            self.stdout.write(f"  + {role['title']} @ {company_name}")

        self.stdout.write(self.style.SUCCESS(f"Static seed: {saved} jobs inserted."))
        return saved

    # ------------------------------------------------------------------
    def _scrape_live(self) -> int:
        """Scrape Greenhouse boards for India-focused tech companies."""
        greenhouse_boards = [
            # Indian-headquartered / India-heavy hiring
            "razorpay", "meesho", "groww", "browserstack", "freshworks",
            "swiggy", "phonepe", "sprinklr", "darwinbox", "zenoti",
            # Global companies with large India engineering centres
            "openai", "anthropic", "stripe", "notion", "figma",
            "databricks", "huggingface", "cohere", "replit", "mistral",
        ]
        lever_boards = [
            "asana", "brex", "affirm", "benchling", "discord",
            "gusto", "webflow", "scaleai", "instacart", "openai",
        ]

        saved = 0
        now = timezone.now()

        for board in greenhouse_boards:
            try:
                jobs = _fetch_greenhouse(board, limit=15)
                for j in jobs:
                    if _is_india_or_remote(j.get("location", "")):
                        if _save_one(j, now):
                            saved += 1
            except Exception as exc:
                logger.warning(f"Greenhouse {board} failed: {exc}")
            time.sleep(0.3)

        for board in lever_boards:
            try:
                jobs = _fetch_lever(board, limit=15)
                for j in jobs:
                    if _is_india_or_remote(j.get("location", "")):
                        if _save_one(j, now):
                            saved += 1
            except Exception as exc:
                logger.warning(f"Lever {board} failed: {exc}")
            time.sleep(0.3)

        self.stdout.write(self.style.SUCCESS(f"Live scrape: {saved} India/Remote jobs inserted."))
        return saved


# ------------------------------------------------------------------
# Lightweight Greenhouse / Lever scrapers
# ------------------------------------------------------------------

def _is_india_or_remote(location: str) -> bool:
    loc = (location or "").lower()
    return any(kw in loc for kw in ("india", "remote", "bengaluru", "bangalore", "hyderabad",
                                     "mumbai", "pune", "chennai", "delhi", "noida", "gurugram"))


_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; FyndrJobAggregator/1.0)"}


def _fetch_greenhouse(board: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Fetch jobs from Greenhouse job board API."""
    url = f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true"
    resp = requests.get(url, headers=_HEADERS, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    results = []
    for j in data.get("jobs", [])[:limit]:
        # Extract location string
        loc_parts = [o.get("name", "") for o in j.get("offices", [])]
        location = ", ".join(loc_parts) or "Remote"
        # Build skills from departments as rough proxy
        dept = j.get("departments", [{}])[0].get("name", "") if j.get("departments") else ""
        results.append({
            "external_id": str(j.get("id", "")),
            "source": f"greenhouse_{board}",
            "source_type": "scraped",
            "title": j.get("title", ""),
            "company": board.title(),
            "location": location,
            "url": j.get("absolute_url", ""),
            "apply_url": j.get("absolute_url", ""),
            "application_mode": "redirect",
            "description": (j.get("content") or "")[:2000],
            "requirements": "",
            "skills_required": dept,
            "experience_level": "mid",
            "job_type": "full-time",
            "employment_mode": "hybrid",
            "industry": "Technology",
            "is_active": True,
        })
    return results


def _fetch_lever(board: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Fetch jobs from Lever job board API."""
    url = f"https://api.lever.co/v0/postings/{board}?mode=json&limit={limit}"
    resp = requests.get(url, headers=_HEADERS, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    results = []
    for j in data[:limit]:
        location = j.get("categories", {}).get("location", "") or j.get("workplaceType", "Remote")
        team = j.get("categories", {}).get("team", "")
        results.append({
            "external_id": j.get("id", ""),
            "source": f"lever_{board}",
            "source_type": "scraped",
            "title": j.get("text", ""),
            "company": board.title(),
            "location": location,
            "url": j.get("hostedUrl", ""),
            "apply_url": j.get("applyUrl", j.get("hostedUrl", "")),
            "application_mode": "redirect",
            "description": (j.get("descriptionPlain") or j.get("description") or "")[:2000],
            "requirements": "",
            "skills_required": team,
            "experience_level": "mid",
            "job_type": "full-time",
            "employment_mode": "hybrid",
            "industry": "Technology",
            "is_active": True,
        })
    return results


def _save_one(jd: Dict[str, Any], now) -> bool:
    """Save a single job dict; return True if new record created."""
    try:
        title = jd.get("title") or ""
        company = jd.get("company") or ""
        url = jd.get("url") or ""
        if not (title and company and url):
            return False

        ext_id = jd.get("external_id") or ""
        source = jd.get("source") or "live"

        qs = (
            JobPosting.objects.filter(external_id=ext_id, source=source)
            if ext_id
            else JobPosting.objects.filter(title__iexact=title, company__iexact=company)
        )
        if qs.exists():
            return False

        allowed = {
            "external_id", "title", "company", "company_logo", "location", "url", "source",
            "date_posted", "date_scraped", "job_type", "employment_mode", "description",
            "requirements", "skills_required", "skills_preferred", "experience_level",
            "education_level", "certifications", "tools_technologies", "salary_min",
            "salary_max", "currency", "compensation_type", "benefits", "bonus_equity",
            "company_size", "industry", "company_rating", "company_website",
            "application_deadline", "application_method", "is_active", "raw_data",
            "apply_url", "source_type", "application_mode",
        }
        data = {k: v for k, v in jd.items() if k in allowed}
        data.setdefault("date_scraped", now)
        data.setdefault("is_active", True)
        JobPosting.objects.create(**data)
        return True
    except Exception as e:
        logger.warning(f"_save_one error: {e}")
        return False

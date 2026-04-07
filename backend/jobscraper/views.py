from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from .models import JobPosting
from .serializers import JobPostingSerializer, JobPostingListSerializer, RecruiterJobSerializer
from .permissions import IsRecruiter


class JobPostingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for JobPosting model providing read-only access to job data.
    Supports filtering, searching, and pagination.
    """
    queryset = JobPosting.objects.filter(is_active=True).order_by('-date_posted', '-date_scraped')
    serializer_class = JobPostingListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtering options
    filterset_fields = {
        'source': ['exact', 'in'],
        'source_type': ['exact', 'in'],
        'application_mode': ['exact', 'in'],
        'recruiter_owner': ['exact'],
        'is_active': ['exact'],
        'location': ['icontains', 'exact'],
        'company': ['icontains', 'exact'],
        'date_posted': ['gte', 'lte', 'exact'],
        'date_scraped': ['gte', 'lte', 'exact'],
    }
    
    # Search fields
    search_fields = ['title', 'company', 'location', 'description']
    
    # Ordering options
    ordering_fields = ['date_posted', 'date_scraped', 'title', 'company']
    ordering = ['-date_posted', '-date_scraped']
    
    def get_serializer_class(self):
        """Use detailed serializer for retrieve, list serializer for list."""
        if self.action == 'retrieve':
            return JobPostingSerializer
        return JobPostingListSerializer
    
    def get_queryset(self):
        """Custom queryset with additional filtering options."""
        queryset = super().get_queryset()
        
        # Filter by country (for India-specific jobs)
        country = self.request.query_params.get('country', None)
        if country:
            if country.lower() == 'india':
                # Filter for India locations
                india_keywords = [
                    'india', 'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai',
                    'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur',
                    'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri',
                    'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
                    'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi',
                    'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai',
                    'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur',
                    'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur',
                    'kota', 'gurgaon', 'chandigarh', 'solapur', 'hubli', 'tiruchirappalli',
                    'bareilly', 'mysore', 'tiruppur', 'guwahati', 'salem', 'mira',
                    'bhiwandi', 'saharanpur', 'gorakhpur', 'bikaner', 'amravati',
                    'noida', 'jamshedpur', 'bhilai', 'warangal', 'cuttack', 'firozabad',
                    'kochi', 'bhavnagar', 'dehradun', 'durgapur', 'asansol', 'rourkela',
                    'nanded', 'kolhapur', 'ajmer', 'akola', 'gulbarga', 'jamnagar',
                    'ujjain', 'loni', 'siliguri', 'jhansi', 'ulhasnagar', 'nellore',
                    'jammu', 'sangli', 'belgaum', 'mangalore', 'ambattur', 'tirunelveli',
                    'malegaon', 'gaya', 'jalgaon', 'udaipur', 'maheshtala'
                ]
                
                # Create Q objects for each keyword
                location_q = Q()
                for keyword in india_keywords:
                    location_q |= Q(location__icontains=keyword)
                
                queryset = queryset.filter(location_q)
        
        # Filter by employment type (extracted from description)
        employment_type = self.request.query_params.get('employment_type', None)
        if employment_type:
            if employment_type.lower() == 'full-time':
                queryset = queryset.filter(
                    Q(description__icontains='full-time') | Q(description__icontains='full time')
                )
            elif employment_type.lower() == 'part-time':
                queryset = queryset.filter(
                    Q(description__icontains='part-time') | Q(description__icontains='part time')
                )
            elif employment_type.lower() == 'contract':
                queryset = queryset.filter(description__icontains='contract')
            elif employment_type.lower() == 'internship':
                queryset = queryset.filter(description__icontains='intern')
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if date_from:
            queryset = queryset.filter(date_posted__gte=date_from)
        if date_to:
            queryset = queryset.filter(date_posted__lte=date_to)
        
        # Optional explicit params
        recruiter_owner = self.request.query_params.get('recruiter_owner')
        if recruiter_owner:
            queryset = queryset.filter(recruiter_owner_id=recruiter_owner)

        source_type = self.request.query_params.get('source_type')
        if source_type:
            queryset = queryset.filter(source_type=source_type)

        application_mode = self.request.query_params.get('application_mode')
        if application_mode:
            queryset = queryset.filter(application_mode=application_mode)

        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            if is_active in ['true', 'True', '1']:
                queryset = queryset.filter(is_active=True)
            elif is_active in ['false', 'False', '0']:
                queryset = queryset.filter(is_active=False)

        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get statistics about available jobs."""
        queryset = self.get_queryset()
        
        stats = {
            'total_jobs': queryset.count(),
            'companies': queryset.values('company').distinct().count(),
            'locations': queryset.values('location').distinct().count(),
            'sources': queryset.values('source').distinct().count(),
            'by_source': list(queryset.values('source').annotate(count=Count('id'))),
            'by_company': list(queryset.values('company').annotate(count=Count('id')).order_by('-count')[:10]),
            'by_location': list(queryset.values('location').annotate(count=Count('id')).order_by('-count')[:10]),
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def filters(self, request):
        """Get available filter options."""
        queryset = self.get_queryset()
        
        filters_data = {
            'companies': list(queryset.values_list('company', flat=True).distinct().order_by('company')),
            'locations': list(queryset.values_list('location', flat=True).distinct().order_by('location')),
            'sources': list(queryset.values_list('source', flat=True).distinct().order_by('source')),
        }
        
        return Response(filters_data)
    
    @action(detail=False, methods=['get'])
    def india_jobs(self, request):
        """Get jobs specifically for India."""
        # Override the queryset to only include India jobs
        self.request.query_params = self.request.query_params.copy()
        self.request.query_params['country'] = 'india'
        
        return self.list(request)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def matched_jobs(self, request):
        """Return jobs ranked by match score against the authenticated user's profile."""
        from fyndr_auth.models import JobSeekerProfile
        from fyndr_auth.utils.profile_utils import normalize_skills_field

        try:
            profile = JobSeekerProfile.objects.get(user=request.user)
        except JobSeekerProfile.DoesNotExist:
            return self.list(request)

        # Gather profile signals
        profile_skills_raw = profile.skills or []
        profile_skill_names, _ = normalize_skills_field(profile_skills_raw)
        profile_skills_lower = {s.lower() for s in profile_skill_names if s}

        # Primary matching signal: onboarding-derived suited roles
        suited_roles_detailed = profile.suited_job_roles_detailed or []
        normalized_suited_roles = []
        for item in suited_roles_detailed:
            if not isinstance(item, dict):
                continue
            role_name = (item.get('role') or '').strip()
            if not role_name:
                continue
            try:
                match_percent = float(item.get('match_percent'))
            except (TypeError, ValueError):
                match_percent = 0.0
            normalized_suited_roles.append({
                'role': role_name,
                'role_lower': role_name.lower(),
                'match_percent': max(0.0, min(100.0, match_percent)),
            })

        preferred_roles = profile.preferred_roles or []
        job_title = (profile.job_title or '').lower()
        location = (profile.location or '').lower()
        years_exp = profile.years_of_experience or 0

        queryset = self.get_queryset()

        # Annotate each job with a Python-computed match score then sort
        jobs_with_scores = []
        for job in queryset[:500]:  # cap for performance
            title_lower = (job.title or '').lower()
            desc_lower = (job.description or '').lower()
            job_text = f"{job.title} {job.description or ''} {job.requirements or ''}".lower()

            # -----------------------------------------------------------------
            # Role-first scoring model
            # - suited_job_roles_detailed drives up to 90 points (base score)
            # - all other signals together can add up to 10 points max
            # -----------------------------------------------------------------
            role_base_score = 0.0

            # 1) Use suited roles as primary signal
            for role_item in normalized_suited_roles:
                role_lower = role_item['role_lower']
                role_tokens = [token for token in role_lower.split() if len(token) > 2]

                candidate = 0.0
                if role_lower in title_lower:
                    candidate = role_item['match_percent']
                elif role_lower in desc_lower:
                    candidate = role_item['match_percent'] * 0.9
                elif role_tokens:
                    token_hits = sum(1 for token in role_tokens if token in title_lower)
                    token_ratio = token_hits / len(role_tokens)
                    if token_ratio >= 0.6:
                        candidate = role_item['match_percent'] * 0.8
                    elif token_ratio >= 0.4:
                        candidate = role_item['match_percent'] * 0.65

                if candidate > role_base_score:
                    role_base_score = candidate

            # 2) Backward-compatible fallback when suited roles are missing
            if role_base_score == 0.0:
                fallback_role_score = 0.0
                if job_title and job_title in title_lower:
                    fallback_role_score = 75.0
                elif any(role.lower() in title_lower for role in preferred_roles):
                    fallback_role_score = 70.0
                elif any(word in title_lower for word in job_title.split() if len(word) > 2):
                    fallback_role_score = 55.0
                role_base_score = fallback_role_score

            role_component = min(90.0, role_base_score * 0.9)

            # Other signals contribute a maximum of 10 points total.
            other_component = 0.0

            # Skills bonus (up to 7)
            if profile_skills_lower:
                matched = sum(1 for sk in profile_skills_lower if sk in job_text)
                skill_ratio = matched / len(profile_skills_lower)
                other_component += min(7.0, skill_ratio * 7.0)

            # Location bonus (up to 2)
            job_loc = (job.location or '').lower()
            if location and location in job_loc:
                other_component += 2.0
            elif location and any(w in job_loc for w in location.split() if len(w) > 2):
                other_component += 1.0

            # Experience signal (up to 1) - weak boost only
            if years_exp and years_exp > 0:
                other_component += 1.0

            other_component = min(10.0, other_component)
            score = role_component + other_component

            # Legacy fallback role/title scoring removed from primary path
            # to keep suited roles as the principal signal.

            # Clamp between 0 and 100
            score = max(0.0, min(100.0, score))
            score = int(round(score))
            jobs_with_scores.append((score, job))

        # Sort by score descending
        jobs_with_scores.sort(key=lambda x: x[0], reverse=True)

        # Paginate manually
        page_jobs = [j for _, j in jobs_with_scores]
        serializer = JobPostingListSerializer(page_jobs[:50], many=True, context={'request': request})
        data = serializer.data
        # Attach match_score to each job
        for i, item in enumerate(data):
            item['match_score'] = jobs_with_scores[i][0]

        return Response({'results': data, 'total': len(page_jobs)})


class RecruiterJobViewSet(viewsets.ModelViewSet):
    """CRUD for recruiter-posted jobs. Recruiter-only."""
    permission_classes = [IsRecruiter]
    serializer_class = RecruiterJobSerializer

    def get_queryset(self):
        user = self.request.user
        return JobPosting.objects.filter(
            source_type='recruiter', recruiter_owner=user
        ).annotate(applications_count=Count('applications')).order_by('-updated_at')

    def perform_create(self, serializer):
        instance = serializer.save()
        # Emit WS events
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            if channel_layer:
                payload = {
                    'type': 'job_created',
                    'job': {
                        'id': instance.id,
                        'title': instance.title,
                        'company': instance.company,
                        'application_mode': instance.application_mode,
                        'source_type': instance.source_type,
                    }
                }
                async_to_sync(channel_layer.group_send)(f"recruiter_{self.request.user.id}", payload)
                async_to_sync(channel_layer.group_send)("job_feed", payload)
        except Exception:
            pass

    def perform_update(self, serializer):
        instance = serializer.save()
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            if channel_layer:
                payload = {
                    'type': 'job_updated',
                    'job': {
                        'id': instance.id,
                        'title': instance.title,
                        'company': instance.company,
                        'application_mode': instance.application_mode,
                        'source_type': instance.source_type,
                    }
                }
                async_to_sync(channel_layer.group_send)(f"recruiter_{self.request.user.id}", payload)
                async_to_sync(channel_layer.group_send)("job_feed", payload)
        except Exception:
            pass

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active', 'updated_at'])

from django.contrib import admin
from .models import ResumeSnapshot


@admin.register(ResumeSnapshot)
class ResumeSnapshotAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'updated_at')
    list_filter = ('updated_at',)
    search_fields = ('title', 'user__email', 'user__username')

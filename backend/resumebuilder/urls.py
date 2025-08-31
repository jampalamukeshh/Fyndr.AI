from django.urls import path
from .views import (
    ResumeExportView,
    ResumeTemplatesView,
    ResumeSnapshotView,
    ResumeSnapshotDetailView,
)

urlpatterns = [
    path('export/', ResumeExportView.as_view(), name='resume-export'),
    path('templates/', ResumeTemplatesView.as_view(), name='resume-templates'),
    path('snapshots/', ResumeSnapshotView.as_view(), name='resume-snapshots'),
    path('snapshots/<int:pk>/', ResumeSnapshotDetailView.as_view(), name='resume-snapshot-detail'),
]

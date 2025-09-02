from rest_framework import serializers
from .models import ResumeSnapshot


class ResumeSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSnapshot
        fields = ['id', 'title', 'data', 'created_at', 'updated_at']

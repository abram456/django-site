# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.utils.timezone import now

class Page(models.Model):
    type = models.CharField(max_length=4, choices=[('code', 'Code'), ('html', 'Html')], default='html')
    title = models.CharField(max_length=70)
    meta_desc = models.CharField(max_length=160, blank=True, null=True)
    meta_keywords = models.CharField(max_length=160, blank=True, null=True)
    url = models.CharField(max_length=50)
    content = models.TextField()
    created_by = models.IntegerField(blank=True, null=True)
    modified_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True, default=1)
    is_deleted = models.BooleanField(blank=True, null=True, default=0)

    def __str__(self):
        return '{}'.format(self.url)

    class Meta:
        managed = True
        db_table = 'page'
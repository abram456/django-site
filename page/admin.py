from django.contrib import admin
from . models import Page
from django.db.models.functions import Lower

# Register your models here.
# Register your models here.
@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    exclude = ('is_deleted', 'created_by', 'modified_by')
    list_display = ('title', 'url')
    search_fields = ['title', 'url']

    def get_ordering(self, request):
        return [Lower('title')]  # sort case insensitive
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from zinnia.models.entry import Entry
from zinnia.admin.entry import EntryAdmin

class LangEntryAdmin(EntryAdmin):
  fieldsets = ((_('Content'), {'fields': (
    'title', 'content', 'image', 'status', 'language')}),) + \
    EntryAdmin.fieldsets[1:]

# Unregister the default EntryAdmin
# then register the EntryGalleryAdmin class
admin.site.unregister(Entry)
admin.site.register(Entry, LangEntryAdmin)
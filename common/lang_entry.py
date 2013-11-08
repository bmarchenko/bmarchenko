from django.db import models
from zinnia.models.entry import EntryAbstractClass
from zinnia.managers import entries_published, EntryPublishedManager
from middleware import get_lang
from django.conf import settings

class EntryPublishedLangManager(EntryPublishedManager):

    def get_query_set(self):
        language = get_lang()
        print language
        result = entries_published(super(EntryPublishedManager, self).get_query_set())
        if language:
            result = result.filter(language=language)
            print result
        return result

class LangEntry(EntryAbstractClass):
    language = models.CharField(max_length=2, choices=settings.LANGUAGES, default=1)
    published = EntryPublishedLangManager()

    def __unicode__(self):
        return u'Entry %s' % self.title

    class Meta(EntryAbstractClass.Meta):
        abstract = True
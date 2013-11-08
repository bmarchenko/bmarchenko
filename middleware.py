# coding: utf-8

from django.conf import settings
from django.utils import translation
from threading import current_thread
import re

class GlobalLocaleMiddleware(object):
    _languages = {}

    @staticmethod
    def get_lang():
        try:
            return GlobalLocaleMiddleware._languages[current_thread()]
        except KeyError:
            return None

    def process_request(self, request):
        lang_m = re.compile(r'^/(\w+)/')
        if lang_m.match(request.path):
            language = lang_m.match(request.path).groups(0)[0]
            if language in tuple(x[0] for x in settings.LANGUAGES):
                request.urlconf = u"urls_{0}".format(language)
                translation.activate(language)
                request.LANGUAGE_CODE = language
                GlobalLocaleMiddleware._languages[current_thread()] = language

    def process_response(self, request, response):
        thread = current_thread()
        try:
            del GlobalLocaleMiddleware._languages[thread]
        except KeyError:
            pass
        translation.deactivate()
        return response

def get_lang():
    return GlobalLocaleMiddleware.get_lang()
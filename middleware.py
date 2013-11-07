# coding: utf-8

from django.conf import settings
from django.utils import translation
from threading import current_thread


class GlobalLocaleMiddleware(object):
    _languages = {}

    @staticmethod
    def get_lang():
        try:
            return GlobalLocaleMiddleware._languages[current_thread()]
        except KeyError:
            return None

    def process_request(self, request):
        language = "uk" if request.path.startswith(u"/{0}".format("UK")) else "en"
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
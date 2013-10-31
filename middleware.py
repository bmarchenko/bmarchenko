# coding: utf-8

from django.conf import settings
from django.utils import translation
from django.utils.cache import patch_vary_headers


class UkrainianLocaleMiddleware(object):

    def process_request(self, request):

        is_uk = request.path.startswith(u"/{0}".format("UK"))
        if is_uk:
            request.urlconf = u"urls_uk"
            translation.activate("UK")
            request.LANGUAGE_CODE = "UK"
        return None

    def process_response(self, request, response):
        translation.deactivate()
        return response


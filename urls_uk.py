
# coding: utf-8

from django.conf.urls.defaults import patterns, url, include

from urls_en import common_patterns


urlpatterns = patterns("",
    url(r"^uk/", include(common_patterns)),
)
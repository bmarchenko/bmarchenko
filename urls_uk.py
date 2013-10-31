
# coding: utf-8

from django.conf.urls.defaults import patterns, url, include

from urls import common_patterns


urlpatterns = patterns("",
    #url(r"^$", RedirectToMicrositeView.as_view(microsite=ARABIC_MICROSITE_SLUG)),
    url(r"^UK/", include(common_patterns)),
)
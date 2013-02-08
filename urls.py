from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from django.views.generic.simple import direct_to_template
from search.views import *
urlpatterns = patterns('',

    # Examples:
    url(r'^$', direct_to_template, dict(template='stations.html'), name='home'),
    url(r'get-stations', FilterView.as_view(), {}, name='get_stations'),
    url(r'get-trains', GetTrainsView.as_view(), {}, name='get_trains'),
    # url(r'^tickets/', include('tickets.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

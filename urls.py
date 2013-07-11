from django.conf.urls.defaults import patterns, include, url
from django.views.generic import TemplateView
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
urlpatterns = patterns('',

    # Examples:
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="index"),
    url(r'projects', TemplateView.as_view(template_name='projects.html'), name="projects"),
    url(r'materials', TemplateView.as_view(template_name='materials.html'), name="materials"),
    url(r'technologies', TemplateView.as_view(template_name='technologies.html'), name="technologies"),
#    url(r'get-stations', FilterView.as_view(), {}, name='get_stations'),
#    url(r'get-trains', GetTrainsView.as_view(), {}, name='get_trains'),
    # url(r'^tickets/', include('tickets.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^weblog/', include('zinnia.urls')),
    url(r'^comments/', include('django.contrib.comments.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

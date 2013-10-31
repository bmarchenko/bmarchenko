from django.conf.urls.defaults import patterns, include, url
from django.conf.urls.i18n import i18n_patterns

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
    (r'^i18n/', include('django.conf.urls.i18n')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^weblog/', include('zinnia.urls')),
    url(r'^comments/', include('django.contrib.comments.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

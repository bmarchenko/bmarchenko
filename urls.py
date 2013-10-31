from django.conf.urls.defaults import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from views import SwitchLanguageView
from django.views.generic import TemplateView
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
common_patterns = patterns('',

    # Examples:
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="index"),
    url(r'projects', TemplateView.as_view(template_name='projects.html'), name="projects"),
    url(r'materials', TemplateView.as_view(template_name='materials.html'), name="materials"),
    url(r'technologies', TemplateView.as_view(template_name='technologies.html'), name="technologies"),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^weblog/', include('zinnia.urls')),
    url(r'^comments/', include('django.contrib.comments.urls')),
    url(r"^switch-lang/(?P<lang>(?:EN|UK))/$", SwitchLanguageView.as_view(), name="switch_language"),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns = patterns('',
    url(r"^$", SwitchLanguageView.as_view(), {"lang": "EN"}, name="switch_language"),
    url(r"^EN/", include(common_patterns)),
)

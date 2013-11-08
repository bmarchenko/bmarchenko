from django.conf.urls.defaults import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from views import SwitchLanguageView
from django.views.generic import TemplateView
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
common_patterns = patterns('',

    url(r'^$', TemplateView.as_view(template_name='index.html'), name="index"),
    url(r'about', TemplateView.as_view(template_name='about.html'), name="about"),
    url(r'materials', TemplateView.as_view(template_name='materials.html'), name="materials"),
    url(r'technologies', TemplateView.as_view(template_name='technologies.html'), name="technologies"),

    url(r'^weblog/', include('zinnia.urls')),
    url(r'^comments/', include('django.contrib.comments.urls')),
    url(r"^switch-lang/(?P<lang>(?:en|uk))/$", SwitchLanguageView.as_view(), name="switch_language"),
    url(r'^admin/', include(admin.site.urls)),

)

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r"^$", SwitchLanguageView.as_view(), {"lang": "en"}, name="switch_language"),
    url(r"^en/", include(common_patterns)),
)

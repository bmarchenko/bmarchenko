# Django settings for tickets project.
import os, sys
gettext = lambda s: s
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
PUBLIC_DIR = os.path.join(PROJECT_PATH, 'public')
sys.path.insert(0, os.path.join(PROJECT_PATH, "apps"))

LANGUAGE_CODE = 'en'

LANGUAGES = [
    ('en', 'English'),
    ('uk', 'Ukrainian'),
    ]

DATE_FORMAT = 'F j, Y'

MEDIA_ROOT = os.path.join(PUBLIC_DIR, "media")
MEDIA_URL = "/media/"
ADMIN_MEDIA_PREFIX="/static/admin/"

STATIC_ROOT = os.path.join(PUBLIC_DIR, 'static-root')
STATIC_URL = '/static/' if DEBUG else 'http://bmarchenko.com/static/'
ADMIN_TOOLS_MEDIA_URL = "/static/"
TIME_ZONE = 'America/Chicago'
USE_TZ = True
from imp import find_module
STATICFILES_DIRS = (
    os.path.join(PUBLIC_DIR, 'static'),
    )

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

LOCALE_PATHS = (
    os.path.join(PROJECT_PATH, 'locale'),
)
# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
    'django_scss.finders.SCSSFinder',
    'coffeescript.finders.CoffeescriptFinder',

)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'x=ge=@!+ytx93^ndz8r+j_urt8r(_qk2ntnkx7-glwmbdmfk3i'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
#    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'middleware.UkrainianLocaleMiddleware'

)

ROOT_URLCONF = 'bmarchenko.urls'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_PATH, "templates")
)
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.i18n',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'zinnia.context_processors.version',)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.comments',
    'django_extensions',
    'pygmentize',
    'zinnia',
    'south',
    'tagging',
    'mptt',
    'django_scss',
    'coffeescript'
    # Uncomment the next line to enable the admin:

    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

try:
    from local_settings import *
except:
    pass
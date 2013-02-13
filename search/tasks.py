# Create your views here.
from django.views.generic import View, TemplateView, DetailView
from django.http import HttpResponse, HttpResponseRedirect, Http404
from celery import task
from search.forms import QueryForm
from django.core.mail import send_mail
try:
    import json
except ImportError:
    import simplejson as json
from search.models import Station
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import redirect
import urllib2, urllib
from django.views.generic.edit import FormView

@task(name='search.tasks.get_trains', default_retry_delay=1 * 60, max_retries=500)
def get_trains(data, attempt, res_base):

    res = urllib2.urlopen('http://www.pz.gov.ua/rezerv/aj_g60.php', data['query']).read()
    if not res_base:
        print 'no res base'
        res_base = res
    base_dict = json.loads(res_base)
    base_trains = base_dict['trains']
    kype = data['kype']
    platzkart = data['platzcart']
    # import ipdb; ipdb.set_trace()

    if res == res_base:
        attempt += 1
        print 'no change in tickets'
        print str(attempt)
        return get_trains.retry(args=[data, attempt, res_base])


    print 'yes news'
    msg = u"New tickets: "
    res_dict = json.loads(res)
    if res_dict.get('trains'):
        print str(res_dict.get('trains'))
        print 'comparing to '
        print str(base_trains)
        # return 'yes'
        # new_trains = list(set(res_dict['trains']) - set(base_trains))
        # if new_trains:
        for train in res_dict['trains']:
            base_train = [_ for i,_ in enumerate(base_trains) if _['train'] == train['train']][0]
            if base_train:
                if kype:
                    if base_train['k'] != train['k']:
                        msg += u'Train '+str(train['train'])+u' new kype '+str(train['k'])+u'instead of '+str(base_train['k'])
                if platzkart:
                    if base_train['p'] != train['p']:
                        msg += u'Train '+str(train['train'])+u' new platzkart '+str(train['p'])+u'instead of '+str(base_train['p'])
            else:
                msg+="new train!!"+train['train'][0]
            print msg
        send_mail("New tickets!", msg, 'bogdan.marko@gmail.com',
                      [data['email'],], fail_silently=False)
        return (res, data)
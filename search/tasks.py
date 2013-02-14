from celery import task
from search.forms import QueryForm
from django.core.mail import send_mail
from search.models import Station
import urllib2, urllib
try:
    import json
except ImportError:
    import simplejson as json


@task(name='search.tasks.get_trains', default_retry_delay=1 * 60, max_retries=500)
def get_trains(data, attempt, res_base):

    res = urllib2.urlopen('http://www.pz.gov.ua/rezerv/aj_g60.php', data['query']).read()
    if not res_base:
        res_base = res

    if res == res_base:
        attempt += 1
        print 'no change in tickets'
        print str(attempt)
        return get_trains.retry(args=[data, attempt, res_base])

    base_dict = json.loads(res_base)
    base_trains = base_dict['trains']
    kype = data['kype']
    platzkart = data['platzcart']

    print 'yes news'
    msg = u"New tickets: "
    res_dict = json.loads(res)
    if res_dict.get('trains'):
        for train in res_dict['trains']:
            base_train = [_ for i,_ in enumerate(base_trains) if _['train'] == train['train']]
            if base_train:
                base_train = base_train[0]
                if kype:
                    if base_train['k'] < train['k']:
                        msg += 'Train %s new kype %d instead of %d /n' %(str(train['train']['0']), train['k'], base_train['k'])
                if platzkart:
                    if base_train['p'] < train['p']:
                        msg += 'Train %s new platzcart %d instead of %d /n' %(str(train['train']['0']), train['p'], base_train['p'])
            else:
                msg+="new train!! %s with %d kype and %d platzcart" %(train['train'], train['k'], train['p'])
            print msg
        send_mail("New tickets!", msg, 'bogdan.marko@gmail.com',
                      [data['email'],], fail_silently=False)
        return (msg)
    else:
        print 'no trains in new res'
        attempt += 1
        return get_trains.retry(args=[data, attempt, res])
# Create your views here.
from django.views.generic import View, TemplateView, DetailView
from django.http import HttpResponse, HttpResponseRedirect, Http404
from celery import task
from search.forms import QueryForm
try:
    import json
except ImportError:
    import simplejson as json
from search.models import Station
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import redirect
import urllib2, urllib

@task(default_retry_delay=3 * 60)
def get_trains(data):
    res = urllib2.urlopen('http://www.pz.gov.ua/rezerv/aj_g60.php', urllib.urlencode(data['query'])).read()
    ticket_types = data['ticket_types']
    if res == data:
        return get_trains.retry(exc='no change in tickets')
    else:
        return (res, data)

class HomeView(View):
    template='stations.html'
    def get(self):
        form = QueryForm()
    def post(self):
        pass

class FilterView(View):
    def get(self, data):
        ru = None
        query = data.GET.get('stan').upper()
        stations =  Station.objects.filter(name_ukr__startswith=query)
        if not stations:
            stations =  Station.objects.filter(name_ru__startswith=query)
            ru = True
        stations = list(stations.values())
        stations.append({'ru':ru})
#        import ipdb; ipdb.set_trace()
        return HttpResponse(json.dumps(stations), content_type='application/json')


class GetTrainsView(View):
    def post(self, data):
        query = data.POST
#        stations =  Station.objects.filter(f_name__startswith=query)
        u = urllib2.urlopen('http://www.pz.gov.ua/rezerv/aj_g60.php', urllib.urlencode(query))
#        tr = redirect('http://www.pz.gov.ua/rezerv/aj_g60.php/kstotpr=2210700&kstprib=2200001&sdate=11-02-2013')

#        import ipdb; ipdb.set_trace()
        return HttpResponse(u, content_type='application/json')



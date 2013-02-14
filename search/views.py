# Create your views here.
from django.views.generic import View
from django.http import HttpResponse
from search.forms import QueryForm
from search.models import Station
import urllib2, urllib
from django.views.generic.edit import FormView
from search.tasks import get_trains
try:
    import json
except ImportError:
    import simplejson as json


class IndexView(FormView):
    template_name = 'stations.html'
    form_class = QueryForm

    def form_valid(self, form):
        get_trains.delay(form.cleaned_data, 0, None)
        # import ipdb; ipdb.set_trace()
        return HttpResponse(json.dumps({'success': True}), content_type='application/json')


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
        return HttpResponse(json.dumps(stations), content_type='application/json')


class GetTrainsView(View):
    def post(self, data):
        query = data.POST
        u = urllib2.urlopen('http://www.pz.gov.ua/rezerv/aj_g60.php', urllib.urlencode(query))
        return HttpResponse(u, content_type='application/json')



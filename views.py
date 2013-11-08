import re
import urllib

from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic import View

class SwitchLanguageView(View):

    def get(self, request, *args, **kwargs):
        source_url = request.GET.get("from")
        target_lang = kwargs.get("lang")
        if source_url:
            URL_RE = re.compile(r"^/(en|uk)")
            try:
                return redirect(URL_RE.sub("/{0}".format(target_lang), source_url))
            except:
                pass
        elif request.path == "/":
            return redirect("/{0}".format(target_lang))


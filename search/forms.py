from django import forms
from search.models import Query

class QueryForm(forms.ModelForm):
    class Meta:
        model = Query

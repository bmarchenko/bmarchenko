from django import forms
from search.models import Query

class QueryForm(forms.ModelForm):
    query = forms.CharField(widget=forms.HiddenInput())
    class Meta:
        model = Query
        exclude = ('attempts',)

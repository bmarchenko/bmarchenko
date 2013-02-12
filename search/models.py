from django.db import models

class Station(models.Model):
    name_ukr = models.CharField(max_length=300)
    name_ru = models.CharField(max_length=300, blank=True, null=True)

    def __unicode__(self):
        return self.name_ukr


class Query(models.Model):
    kype = models.BooleanField(default=True)
    platzcart = models.BooleanField(default=True)
    phone = models.IntegerField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    query = models.CharField(max_length=1000)
    attempts = models.IntegerField(blank=True, null=True)

    def __unicode__(self):
        return self.query
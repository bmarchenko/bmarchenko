# -*- coding: utf-8 -*-
from django.db import models

COUNTRIES = (
    (1, u'Україна'),
    (2, u'Казахстан'),
    (3, u'Російська Федерація'),
    (4, u'Білорусь'),
    (5, u'Азербайджан'),
    (6, u'Польща'),
    (7, u'Молдова, Республіка'),
    (8, u'Угорщина'),
    (9, u'Узбекистан'),
    (10, u'Словаччина'),
    (11, u'Болгарія'),
    (12, u'Румунія'),
    (13, u'Сербія')
)

class Station(models.Model):
    name_ukr = models.CharField(max_length=300)
    name_ru = models.CharField(max_length=300, blank=True, null=True)

    def __unicode__(self):
        return self.name_ukr

class Station_schedule(models.Model):
    country = models.IntegerField(choices=COUNTRIES, blank=True, null=True)
    name = models.CharField(max_length=300)
    station = models.OneToOneField(Station, blank=True, null=True)

    def __unicode__(self):
        return self.name

class Cities(models.Model):
    country = models.IntegerField(choices=COUNTRIES, blank=True, null=True)
    name = models.CharField(max_length=300)

    def __unicode__(self):
        return self.name

class Query(models.Model):
    kype = models.BooleanField(default=True)
    platzcart = models.BooleanField(default=True)
    phone = models.IntegerField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    query = models.CharField(max_length=1000)
    attempts = models.IntegerField(blank=True, null=True)

    def __unicode__(self):
        return self.query
from django.db import models

class Station(models.Model):
    name_ukr = models.CharField(max_length=300)
    name_ru = models.CharField(max_length=300, blank=True, null=True)

    def __unicode__(self):
        return self.name_ukr
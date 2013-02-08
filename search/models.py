from django.db import models

class Station(models.Model):
    f_name = models.CharField(max_length=300)

    def __unicode__(self):
        return self.f_name
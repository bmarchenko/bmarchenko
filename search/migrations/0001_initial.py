# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Station'
        db.create_table('search_station', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('f_name', self.gf('django.db.models.fields.CharField')(max_length=300)),
            ('nom', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal('search', ['Station'])


    def backwards(self, orm):
        # Deleting model 'Station'
        db.delete_table('search_station')


    models = {
        'search.station': {
            'Meta': {'object_name': 'Station'},
            'f_name': ('django.db.models.fields.CharField', [], {'max_length': '300'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nom': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['search']
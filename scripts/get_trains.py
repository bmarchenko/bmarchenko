import urllib2
trains=[]

for i in range(43874, 100000):
    if urllib2.urlopen('http://uz.gov.ua/passengers/timetables/?ntrain='+str(i)+'&by_id=1').read().find('No information found') == -1:
        print 'yes'; print i
        trains.append(i)
    else:
        print 'No info'
        print i

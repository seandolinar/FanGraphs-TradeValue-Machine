__author__ = 'seandolinar'


import csv
import io
import json
import os

listOut = []
with io.open('tvFull.json', 'w') as jsonOut:
    with io.open('2015TradeValue.csv', encoding='utf-8') as f:

        dictArb = csv.DictReader(f, ['rank','prev','name','control','war2016','sal2016','war2017','sal2017','war2018','sal2018','war2019','sal2019','war2020','sal2020','warTotal','salTotal'])

        print dictArb

        jsonOut.write(u'[')
        i = 0
        for line in dictArb:
            if i > 0:
                jsonOut.write(unicode(json.dumps(line, ensure_ascii=False).encode('utf8')))
                jsonOut.write(u',')
            i += 1

        jsonOut.write(u']')


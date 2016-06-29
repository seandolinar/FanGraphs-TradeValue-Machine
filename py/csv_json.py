__author__ = 'seandolinar'


import csv
import io
import json
import os

listOut = []
with io.open('war.json', 'w') as jsonOut:
    with io.open('war.csv', encoding='utf-8') as f:

        dictArb = csv.DictReader(f, ['Player', '2016', '2017', '2018', '2019', '2020', 'Total'])
        print dictArb


        jsonOut.write(u'[')
        i = 0
        for line in dictArb:
            if i > 0:
                jsonOut.write(unicode(json.dumps(line, ensure_ascii=False).encode('utf8')))
                jsonOut.write(u',')
            i += 1

        jsonOut.write(u']')

#make this to join so I don't have extra commas
    #tonight develop this out so I can reuse and reuse and post to my blog
    #
    #     dictOut = {}
    #
    #     for line in file.read().split('\n'):
    #
    #         for element in line.split(','):
    #
    #             dictOut[]


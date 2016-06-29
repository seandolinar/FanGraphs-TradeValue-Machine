//data class
var data = {
    war: [],
    warPlayer: {},
    fiveYearWar: 0,
    totalSalary: 0,
    year: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    load: function(init) {
        d3.json('json/tvFull.json', function(j) {data.war = j ; init()})
    },
    getAllPlayers: function() {
        console.log(data.war.map(function(d){return d.name}))
        return data.war.map(function(d){return d.name})
    },
    selectPlayer:function(name) {
        data.warPlayer = data.war.filter(function(d) {return d.name == name})[0]
        t.init()
    },
    d: function() {
        data.matrix = []
        var yearArr = data.getYears()
        console.log(yearArr)
        var rowYear = Array.apply(0, Array(yearArr.length)).map(function(d,i) {return i+ parseInt(data.year.slice(0,1)) })
        rowYear.forEach(function(e) {
            data.matrix.push([e, 0, data.format.war(data.warPlayer['war' + e]), data.contractStatus(data.warPlayer['sal' + e])])
        })
        return data.matrix
    },
    g: function() {
        data.matrix = []
        
        data.war.filter(function(e){
           return e.rank > 10 && e.rank < 20
        }).    
        forEach(function(e) {

            var prev  = e.prev ? '<a href="http://www.fangraphs.com/blogs/' + t.getPrevURL(e.prev) + '/">' + e.prev + '</a>' : '-'

            function cell(year) {
                return e['war'+year] && e['sal'+year] ? {v:  data.format.war(e['war'+year]) + '<br/> ' + data.contractStatus(e['sal'+year]), c: b.getColor(e['sal'+year]) } : ''
            }

            data.matrix.push([ {v: e.rank, c: ''}, {v: prev, c: ''}, {v:e.name, c: ''}, cell(2016) , cell(2017), cell(2018), cell(2019), cell(2020)])
        })
        console.log(data.matrix)
        return data.matrix
    },
    summary: function() {
        var ret = {}
        ret['fivewar'] = data.format.war(data.warPlayer.warTotal)
        ret['control'] = data.warPlayer.control
        ret['salTotal'] = data.format.salary(data.warPlayer.salTotal)
        ret['prev'] = data.warPlayer.prev
        return ret
    },
    title: function () {
        var ret= {}
        ret['name'] = data.warPlayer.name
        ret['rank'] = data.warPlayer.rank
        //add other info
        return ret
    },
    format: {
        war: function(war) {            
            return isNaN(war) ? '-' : d3.format('+0.1f')(war)  
        },
        salary: function(num) {
            if (num > 1000000) {
                return '$' + (num/1000000).toFixed(1) + ' M'
            }
            else {
                return '$' + Math.round(num/1000) + ' k'
            }
        }
    },
    contractStatus : function(contract) {
        if (!isNaN(contract) && contract != 0) {
            return  data.format.salary(contract)
        }
        else if (contract == 0){

        }
        else {
            return contract
        }
    },
    getYears: function() {
        var lastYear = parseInt($('.year-in').val())
        var index = data.year.indexOf(lastYear)
        return data.year.slice(0,index+1)
    }
}

//table class
var t = {
    buildTable: function() {
        $('.table-container').show()

        var table = d3.select('.table-contract')
            .selectAll('.table-row')
            .data(data.d())

        var tr = table.enter()
            .append('tr')
            .attr('class', 'table-row')

            table.exit().remove()

        var td = d3.selectAll('.table-row').selectAll('td')
            .data(function(d) {return d;})
            
        td.enter()
            .append('td')
            .attr('class', function(d,i) { return i == 3 ? 'cell-contract' : null })

        td.text(function(d) {return d})
        
        d3.selectAll('.cell-contract').style('background-color', function(d) { return b.getColor(d)})
    },
    buildGrid: function () {
        //abstract this
        var table = d3.select('.grid-table')
            .selectAll('.grid-row')
            .data(data.g())

            var tr = table.enter()
            .append('tr')
            .attr('class', 'grid-row')

            table.exit().remove()

        var td = d3.selectAll('.grid-row').selectAll('td')
            .data(function(d) {return d;})

        td.enter()
            .append('td')

        td.html(function(d) {return d.v}).style('background-color', function(d) {return d.c})

        d3.selectAll('.cell-contract').style('background-color', function(d) { return b.getColor(d)})


    },
    updateSummary: function () {
        var dataLocal = data.summary()
        $('#out-fivewar').text(dataLocal.fivewar)
        $('#out-control').text(dataLocal.control)
        $('#out-allsalary').text(dataLocal.salTotal)

        dataLocal.prev ? $('#out-prevrank').html('<a href="http://www.fangraphs.com/blogs/' + t.getPrevURL(dataLocal.prev) + '/">#' + dataLocal.prev + '</a>') : $('#out-prevrank').text('-')
        
    },
    updateTitle: function() {
        var dataLocal = data.title()
        $('.table-title').text('#' + dataLocal.rank + ' -- ' + dataLocal.name + ', ARZ, OF')
    },
    colorRow: function(item, color) {
        item.style('background-color', color)
    },
    highlightRowOn: function(item) {
        item.style('outline', '3px solid red').classed('highlight', true)
    },
    highlightRowOff: function(item) {
        item.style('outline', '').classed('highlight', false)
    },
    getPrevURL: function(prev) {
        var prevURL = {
            50: '2015-trade-value-50-41',
            40: '2015-trade-value-40-to-31',
            30: '2015-trade-value-30-to-21',
            20: '2015-trade-value-20-11',
            10: '2015-trade-value-the-top-10'
        }
        return prevURL[Math.ceil(prev/10)*10]
    },
    init: function() {
        t.updateSummary()
        t.updateTitle()
        t.buildTable()
        t.buildGrid()
    }
}

//interaction class
var b = {
    buttons: [
        {label: ['Pre-Arb'], color: '#a1e481'}, 
        {label: ['Arb1','Arb2','Arb3','Arb4'], color: '#fde765'}, 
        {label: ['Team Option'], color: '#6699FF'}, 
        {label: ['Player Option'], color: '#e0525e'}
        ],
    buildYears: function() {
            data.year.forEach(function(d) {
                $('.year-in').append($("<option/>").val(d).text(d))
            })
            $('.year-in').val(2020)
        },
    buildButtons: function() {
        var tools = d3.select('.tool-container')
        b.buttons.forEach(function(d){
            tools.append('div')
                .attr('draggable', true)
                .attr('data-value', d.color)
                .attr('class', 'color-swatch')
                .style('background-color', d.color)
                .text(d.label[0])
        })
    },
    rowDrag: function() {
        var row;
        d3.selectAll('.cell-contract').on('dragenter', function() {
            row = d3.select(this)
            t.highlightRowOn(row)
        }).on('dragleave', function(){
            row = d3.select(this)
            t.highlightRowOff(row)
        })

        d3.selectAll('.color-swatch').on('dragend', function() {
            var color = d3.select(this).attr('data-value')
            t.colorRow(row, color)         
        })
    },
    selectYear: function() {
        $('.year-in').change(function() {
            t.init()
        })
    },
    selectPlayer: function() {
                $('#name-in').autocomplete({
            minLength: 0,
            source: data.getAllPlayers(),
            // source: function (request, response) {
            //     $.ajax({
            //         type: 'POST',
            //         url: "contract-estimator.aspx/playersearch",
            //         contentType: "application/json; charset=utf-8",

            //         dataType: "json",
            //         data: '{"input": "' + request.term + '"}',
            //         success: function (data) {
            //             response(data.d);
            //         }
            //     });
            //},
            focus: function (event, ui) {
                event.preventDefault();
                $(this).val(ui.item.label);
            },
            select: function (event, ui) {
                event.preventDefault();
                $(this).val(ui.item.label);
                data.selectPlayer(ui.item.label)
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append(item.label + '<span class="item-year"></span>' )
                .appendTo(ul);
        };
    },
    getColor: function(salary) {
        salary = salary || ''
        var filtered = b.buttons.filter(function(d) {return d.label.includes(salary)})
        return filtered.length ? b.buttons.filter(function(d) {return d.label.includes(salary)})[0].color : null
    },
    init: function() {
        b.buildButtons()
        b.buildYears()
        b.selectYear()
        b.selectPlayer()
        b.rowDrag()
    }
}

//GO!
data.load(function(){
    //t.init()
    b.init()
})


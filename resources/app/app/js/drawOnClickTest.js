var correction = 0;                                         //variable yang menjadi nilai koreksi estimasi (estimasi manual)
$(function () {
    var color = Highcharts.getOptions().colors[0];
    var rgba = new Highcharts.Color(color).setOpacity(0.66).get();
    $('#container').highcharts('StockChart', {
        chart: {
            events: {
                click: function (event) {                   //plot garis horizontal ketika mouse klik (di luar titik data)
                    var chart = '';
                    var chart = this.yAxis[0];
                    chart.removePlotLine('vertLine');
                    chart.addPlotLine({
                        value: event.yAxis[0].value,
                        color: 'red',
                        width: 2,
                        id: 'vertLine',
                        zIndex: 9999,
                        label: {
                            align: 'right',
                            text: event.yAxis[0].value
                        }
                    });
                    correction = event.yAxis[0].value;
                }
            },
        },
        plotOptions: {
            series: {
                events: {
                    click: function (event) {               //plot garis horizontal ketika mouse klik (di dalam titik data)
                        var chart = this.yAxis;
                        chart.removePlotLine('vertLine');
                        chart.addPlotLine({
                            value: chart.toValue(event.y),
                            color: 'red', 
                            width: 2,
                            id: 'vertLine',
                            zIndex: 9999,
                            label: {
                                align: 'right',
                                text: chart.toValue(event.y)
                            }
                        });
                        correction = chart.toValue(event.y);
                    }
                }
            }
        },
        yAxis: {
            plotLines: [{                                   //plot titik estimasi 95e
                color: rgba,
                dashStyle: 'LongDash',
                width: 2,
                value: 0.87,                                //nilai estimasi 95e
                id: '95e',
                label: {
                    text: '95e'
                }
            }, {                                            //plot titik estimasi cluster
                color: rgba,
                dashStyle: 'LongDash',
                width: 2,
                value: 0.81,                                //nilai estimasi cluster
                id: 'cluster',
                label: {
                    text: 'cluster'
                }
            }]
        },
        series: [{
            data: usdeur                                    //data yang akan di plot
        }]
    });
    
    $('#container').mousemove(function(e){                  //plot garis horizontal ketika mouse bergerak
        var chart = Highcharts.charts[0];
        e = chart.pointer.normalize(e);
        var yaxis = chart.yAxis[0];
        yaxis.removePlotLine('plot-line-y');
        var y = yaxis.toValue(e.chartY, false);
        yaxis.addPlotLine({
            value: y,
            color: 'red',
            width: 1,
            id: 'plot-line-y'
        });
    });
});
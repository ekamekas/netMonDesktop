// Dependency :
// Highcharts

var Highcharts = require('highcharts/highstock')
require('highcharts/modules/exporting')(Highcharts)

// Data must be arrays of x and y
function Plot(container, data){
    let color = '#3F51B5';
    let rgba = new Highcharts.Color(color).setOpacity(0.66).get();
    this.data = data
    if(this.data === undefined || this.data === null)
        this.data = []
    this.container = container
    this.plot = (title, subtitle, xTitle, yTitle) => {
        this.chart = Highcharts.chart(container, {
            chart: {
               events: {
                   click: () => {
                       if(this.chart.series[0].data.length == 0) return
                       new Plot("graph1", this.data).humanPlot(title, subtitle, xTitle, yTitle)
                       document.getElementById("sensorDetailsModal").showModal()
                   }
               } 
            },
            title: {
                text: title
            },
            tooltip: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: yTitle
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        enabled: false
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            lang: {
                noData: "Data belum ada"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '1em',
                    color: '#303030'
                }
            },
            series: [{
                type: 'area',
                name: 'Data',
                data: this.data
            }]
        })
    }
    this.humanPlot = (title, subtitle, xTitle, yTitle) => {
        this.correction = 0
        this.chart = Highcharts.stockChart(container, {
            chart: {
                
            },
            title: {
                text: 'Data sensor terhadap waktu'
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        enabled: false
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                series: {
                    allowPointSelect : true,
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                plotLines: [{                                   //plot titik estimasi 95e
                    color: rgba,
                    dashStyle: 'LongDash',
                    width: 2,
                    value: 0.9,                                //nilai estimasi 95e
                    id: '95e',
                    label: {
                        text: '95e'
                    }
                }, {                                            //plot titik estimasi cluster
                    color: rgba,
                    dashStyle: 'LongDash',
                    width: 2,
                    value: 0.8,                                //nilai estimasi cluster
                    id: 'cluster',
                    label: {
                        text: 'cluster'
                    }
                }]
            },
            legend: {
                enabled: false
            },
            series: [{
                type: 'area',
                name: 'Data',
                data: this.data
            }]
        })
        document.getElementById(container).onmousemove = (e) => {                  //plot garis horizontal ketika mouse bergerak
            var chart = this.chart;
            e = chart.pointer.normalize(e);
            var yaxis = chart.yAxis[0];
            yaxis.removePlotLine('plot-line-y');
            var y = yaxis.toValue(e.chartY, false);
            yaxis.addPlotLine({
                value: y,
                dashStyle: 'LongDash',
                color: 'red',
                width: 2,
                zIndex: 9999,
                id: 'plot-line-y',
                label: {
                    align: 'right',
                    text: y.toFixed(4)
                }
            });
        }
        document.getElementById(container).onclick = (e) => {                  //plot garis horizontal ketika mouse bergerak
            var chart = this.chart;
            e = chart.pointer.normalize(e);
            var yaxis = chart.yAxis[0];
            yaxis.removePlotLine('horizLine');
            var y = yaxis.toValue(e.chartY, false);
            yaxis.addPlotLine({
                value: y,
                color: 'red',
                width: 2,
                zIndex: 9999,
                id: 'horizLine',
                label: {
                    align: 'right',
                    text: y.toFixed(4)
                }
            });
        }
    }
}
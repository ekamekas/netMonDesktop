// Dependency :
// Highcharts

var Highcharts = require('highcharts/highstock')
require('highcharts/modules/exporting')(Highcharts)

// Data must be arrays of x and y
function Plot(data, legend){
    let color = '#3F51B5';
    let rgba = new Highcharts.Color(color).setOpacity(0.66).get();
    this.data = data
    if(this.data === undefined || this.data === null)
        this.data = []
    this.correction
    this.addSeries = (chart, data, name, type) => {
        chart.addSeries({
            name: name,
            type: type,
            data: data
        }, false)
    }
    this.redraw = (chart) => {
        chart.redraw()
    }
    this.plot = (container, title, subtitle, xTitle, yTitle) => {
        this.chart = Highcharts.chart(container, {
            chart: {
               events: {
                   click: () => {
                       if(this.data.length == 0) return
                       this.humanPlot("graph1", title, subtitle, xTitle, yTitle)
                       for(let i = 0; i < this.data.length; i++){
                           this.addSeries(this.chart, this.data[i], "Val", "line")
                       }
                       this.redraw(this.chart)
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
            lang: {
                noData: "Data belum ada"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '1em',
                    color: '#303030'
                }
            }
        })
    }
    this.humanPlot = (container, title, subtitle, xTitle, yTitle) => {
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
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            }
        })

        if(sensors.item[document.getElementById("sensorDetailsModal").getAttribute("data-index")]["peaks"]["correction"][0] !== undefined){
            let chart = this.chart;
            let yaxis = chart.yAxis[0];
            yaxis.addPlotLine({
                value: sensors.item[document.getElementById("sensorDetailsModal").getAttribute("data-index")]["peaks"]["correction"][0],
                color: 'red',
                width: 2,
                zIndex: 9999,
                id: 'horizLine',
                label: {
                    align: 'right',
                    text: sensors.item[document.getElementById("sensorDetailsModal").getAttribute("data-index")]["peaks"]["correction"][0]
                }
            });
        }
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
            let chart = this.chart;
            e = chart.pointer.normalize(e);
            let yaxis = chart.yAxis[0];
            yaxis.removePlotLine('horizLine');
            let y = yaxis.toValue(e.chartY, false);
            sensors.item[document.getElementById("sensorDetailsModal").getAttribute("data-index")]["peaks"]["correction"][0] = y.toFixed(4)
            yaxis.addPlotLine({
                value: sensors.item[document.getElementById("sensorDetailsModal").getAttribute("data-index")]["peaks"]["correction"][0],
                color: 'red',
                width: 2,
                zIndex: 9999,
                id: 'horizLine',
                label: {
                    align: 'right',
                    text: sensors.item[document.getElementById("sensorDetailsModal").getAttribute("data-index")]["peaks"]["correction"][0]
                }
            });
        }
    }
}
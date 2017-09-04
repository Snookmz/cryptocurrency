import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartsService} from '../charts.service';
import {AmChartsService, AmChart} from '@amcharts/amcharts3-angular';


@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.css'],
    providers: [ChartsService]
})
export class MonitorComponent implements OnInit, OnDestroy {

    private testing = true;
    private chart: AmChart;

    public messages: Array<any>;
    public errorMessage = '';
    public tradeData: Array<any>;

    private charts = [{
        div: 'liveactivitydiv',
        type: 'activity',
        chartRef: {},
        data: []
    }];

    constructor(private chartsService: ChartsService,
                private AmCharts: AmChartsService) {

        this.messages = [];
        this.tradeData = [];



        if (this.testing) {
            console.log('monitorComponent(), constructor(), charts', this.charts);
        }

        chartsService.getData().subscribe(
            returnData => {
                if (this.testing) {
                    console.log('monitorComponent(), returnData', returnData);
                }

                if (returnData['status'] === 'error') {
                    this.errorMessage = returnData['message'];
                } else {
                    const crunchedData = this.crunchData(returnData);
                    this.createChart(crunchedData);
                }
            }
        );

    }

    private crunchData(data: any) {
        const crunch = [];

        data.reverse();

        for (let i = 0; i < data.length; i++) {

            let date: number;
            date = this.formatDate(data[i]['date']);
            crunch.push({
                time: date,
                price: data[i]['price']
            });


        }
        return crunch;
    }

    private formatDate (date: string) {

        let dateInt = parseInt(date, 10);
        dateInt = dateInt * 1000;
        const d = new Date(dateInt);

        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let hour = d.getHours();
        let min = d.getMinutes();
        let sec = d.getSeconds();

        dateInt = Date.parse(year + '/' + month + '/' + day);

        // date = day + '/' + month + '/' + year + ' ' + hour + ':' + min;

        return dateInt;

    }

    private createChart(data: object) {
        this.chart = this.AmCharts.makeChart('chartdiv', {
            'type': 'serial',
            'theme': 'light',
            'marginTop': 0,
            'marginRight': 80,
            'dataProvider': data,
            'valueAxes': [{
                'axisAlpha': 0,
                'position': 'left'
            }],
            'graphs': [{
                'id': 'g1',
                'balloonText': '[[category]]<br><b><span style="font-size:14px;">[[value]]</span></b>',
                // 'bullet': 'round',
                // 'bulletSize': 8,
                'lineColor': '#d1655d',
                'lineThickness': 1,
                'negativeLineColor': '#637bb6',
                // 'type': 'smoothedLine',
                'valueField': 'price'
            }],
            'chartScrollbar': {
                'graph': 'g1',
                'gridAlpha': 0,
                'color': '#888888',
                'scrollbarHeight': 55,
                'backgroundAlpha': 0,
                'selectedBackgroundAlpha': 0.1,
                'selectedBackgroundColor': '#888888',
                'graphFillAlpha': 0,
                'autoGridCount': true,
                'selectedGraphFillAlpha': 0,
                'graphLineAlpha': 0.2,
                'graphLineColor': '#c2c2c2',
                'selectedGraphLineColor': '#888888',
                'selectedGraphLineAlpha': 1
            },
            'chartCursor': {
                'categoryBalloonDateFormat': 'YYYY',
                'cursorAlpha': 0,
                'valueLineEnabled': true,
                'valueLineBalloonEnabled': true,
                'valueLineAlpha': 0.5,
                'fullWidth': true
            },
            // 'dataDateFormat': 'YYYY',
            'categoryField': 'time',
            'categoryAxis': {
                // 'minPeriod': 'YYYY',
                // 'parseDates': true,
                'minorGridAlpha': 0.1,
                'minorGridEnabled': true,
                'labelRotation': '30',
            },
            'export': {
                'enabled': true
            }
        });
    }



    ngOnInit() {


        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].chartRef = this.chartsService.createChartObject(this.charts[i]);
        }

        this.chartsService.getEventListener().subscribe(event => {

            if (this.testing) {
                console.log('monitorComponent(), getEventListener(), event', event);
                console.log('monitorComponent(), getEventListener(), type', event.type);
            }

            if (event.type === 'message') {
                if (this.testing) {
                    console.log('monitorComponent(), getEventListener, type == message');
                    console.log('monitorComponent(), getEventListener(), event.data', event.data);
                }

                if (event.data.status === 'error') {
                    this.errorMessage = event.data.message;
                } else {
                    // set the timestamp to the current time
                    const time = this.chartsService.getTime();

                    this.tradeData.push({lastPrice: event.data['lastPrice'], timestamp: time});

                    for (let i = 0; i < this.charts.length; i++) {
                        this.AmCharts.updateChart(this.charts[i].chartRef, () => {
                            this.charts[i].chartRef['dataProvider'] = this.tradeData;
                            console.log('================ tradeData', this.tradeData);
                        });
                    }
                }

            }
            if (event.type === 'close') {
                if (this.testing) {
                    console.log('monitorComponent(), getEventListener, type == close');
                }
            }
            if (event.type === 'open') {
                if (this.testing) {
                    console.log('monitorComponent(), getEventListener, type == open');
                }
            }
        });

        // this.send('this is a test');

    }
    public ngOnDestroy() {
        this.chartsService.close();
    }

    public send(message: string) {
        this.chartsService.send(message);
    }

    public isSystemMessage (message: string) {
        return message.startsWith('/') ? '<strong>' + message.substring(1) + '</strong>' : message;
    }
}

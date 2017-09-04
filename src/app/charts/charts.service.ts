import {EventEmitter, Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {AmChartsService} from '@amcharts/amcharts3-angular';
import {Router} from '@angular/router';
import {JsonReturnData} from './charts-defs';

@Injectable()
export class ChartsService {
    private testing = true;
    private btcMarketsUrl = 'http://localhost:8004/btc/';
    private socket: WebSocket;
    private listener: EventEmitter<any> = new EventEmitter();

    constructor(private http: Http,
                private AmCharts: AmChartsService,
                private router: Router,
    ) {
        try {
            this.socket = new WebSocket('ws://localhost:8004/websocket/');
            this.socket.onopen = event => {
                this.listener.emit({'type': 'open', 'data': event});
            };
            this.socket.onclose = event => {
                this.listener.emit({'type': 'close', 'data': event});
            };
            this.socket.onmessage = event => {
                console.log('chartsService() onmessage() event', event);
                this.listener.emit({'type': 'message', 'data': JSON.parse(event.data)});
            };
            this.socket.onerror = event => {
                console.log('chartsService(), onerror(), event ', event);
            };
        } catch (error) {
            console.log('chartsService(), constructor(), catch error', error);
        }
    };



    // send post request to Go. request will come as an Nsc struct
    getData(): Observable<JsonReturnData> {
        return this.http.get(this.btcMarketsUrl )
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    private extractJsonData(res: Response) {
        const body = res.json();
        return body || {};
    }

    private handleError (error: Response | any) {
        // let errMsg: string;
        // if (error instanceof Response) {
        //     const body = error.json() || '';
        //     const err = body.error || JSON.stringify(body);
        //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        // } else {
        //     errMsg = error.message ? error.message : error.toString();
        // }
        // console.error(errMsg);
        // return Observable.throw(errMsg);
        console.log('handlerError called. error', error);
        return [];
    }

    public send(data: string) {
        this.socket.send(data);
    }

    public close() {
        this.socket.close();
    }

    public getEventListener() {
        return this.listener;
    }


    public createChartObject(chart: object) {
        let newChart: object;
        newChart = this.AmCharts.makeChart(chart['div'], {
            'type': 'serial',
            'theme': 'light',
            'marginTop': 0,
            'marginRight': 80,
            'dataProvider': [{lastPrice: 0, timestamp: 0}],
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
                'valueField': 'lastPrice'
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
            // 'dataDateFormat': 'YYYY-MM-DD HH:L:SS',
            'categoryField': 'timestamp',
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

        return newChart;

    }

     public getTime() {

        const d = new Date();

        let monthString: string;
        let dayString: string;
        let hourString: string;
        let minString: string;
        let secString: string;

        const year = d.getFullYear();
        let month = d.getMonth();

        month = month + 1;
        if (month < 10) {
            monthString = String(month) + '0';
        } else {
            monthString = String(month);
        }

        let day = d.getDate();
        day = day + 1;
        if (day < 10) {
            dayString = String(day) + '0';
        } else {
            dayString = String(day);
        }

        const hour = d.getHours()
        if (hour < 10) {
            hourString = String(hour) + '0';
        } else {
            hourString = String(hour);
        }
        const min = d.getMinutes()
        if (min < 10) {
            minString = String(min) + '0';
        } else {
            minString = String(min);
        }

        const sec = d.getSeconds()
        if (sec < 10) {
            secString = String(sec) + '0';
        } else {
            secString = String(sec);
        }

        return year + '/' + monthString + '/' + dayString + ' ' + hourString + ':' + minString + ':' + secString;

    }

}

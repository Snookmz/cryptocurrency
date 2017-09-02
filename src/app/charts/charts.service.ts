import {Injectable} from '@angular/core';
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
    private jsonDataUrl = 'http://localhost:8004/btc/';

    constructor(private http: Http,
                private AmCharts: AmChartsService,
                private router: Router,
    ) {

    };



    // send post request to Go. request will come as an Nsc struct
    getData(): Observable<JsonReturnData> {
        return this.http.get(this.jsonDataUrl )
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
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


}

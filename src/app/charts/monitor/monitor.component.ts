import { Component, OnInit } from '@angular/core';
import {ChartsService} from '../charts.service';
import {AmChartsService, AmChart} from '@amcharts/amcharts3-angular';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
  providers: [ChartsService]
})
export class MonitorComponent implements OnInit {

  private testing = true;
  private chart: AmChart;

  constructor(private chartsService: ChartsService,
              private AmCharts: AmChartsService) {

    chartsService.getData().subscribe(
      returnData => {
        if (this.testing) {
          console.log('monitorComponent(), returnData', returnData);
        }

        const crunchedData = this.crunchData(returnData);

        this.createChart(crunchedData);

      }
    );

  }

  private crunchData(data: any) {
    const crunch = [];

    data.reverse();

    for (let i = 0; i < data.length; i++) {

      let date: number;
      date = this.formatDate(data[i]['date']);

      console.log('==== date', date);

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

    if (this.testing) {
      console.log('monitorComponent(), createChart(), data', data);
    }

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
  }

}

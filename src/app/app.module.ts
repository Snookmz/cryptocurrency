import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { MonitorComponent } from './charts/monitor/monitor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {AmChartsModule} from '@amcharts/amcharts3-angular';

@NgModule({
    declarations: [
        AppComponent,
        MonitorComponent,
        PageNotFoundComponent
    ],
    imports: [
        AmChartsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        FlexLayoutModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

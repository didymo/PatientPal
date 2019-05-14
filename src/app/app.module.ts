import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SurveysListComponent } from './surveys-list/surveys-list.component';
import { SurveyDetailsComponent } from './survey-details/survey-details.component';
import {FormsModule} from '@angular/forms';
import { SurveySearchComponent } from './survey-search/survey-search.component';

@NgModule({
  declarations: [
    AppComponent,
    SurveysListComponent,
    SurveyDetailsComponent,
    SurveySearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

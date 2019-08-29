import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgXformModule } from '@esss/ng-xform';

import { SurveysListComponent } from './surveys-list/surveys-list.component';
import {SurveyDetailsComponent} from './survey-editor/survey-details.component';
import {FormsModule} from '@angular/forms';
import { SurveySearchComponent } from './survey-search/survey-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TabViewsComponent } from './tab-views/tab-views.component';
import {PreviewComponent} from './preview/preview.component';

@NgModule({
  declarations: [
    AppComponent,
    SurveysListComponent,
    SurveyDetailsComponent,
    SurveySearchComponent,
    DashboardComponent,
    NavBarComponent,
    TabViewsComponent,
    PreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgXformModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

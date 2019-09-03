import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import { NgXformModule } from '@esss/ng-xform';

import {SurveyDetailsComponent} from './survey-editor/survey-details.component';
import {FormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NavBarComponent, NewTabViewDialog} from './nav-bar/nav-bar.component';
import {TabViewsComponent, TabViewSearch} from './tab-views/tab-views.component';
import {PreviewComponent} from './preview/preview.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatDialogModule, MatFormFieldModule, MatSnackBarModule} from '@angular/material';
import {SurveyEditorDashboardComponent} from './survey-editor-dashboard/survey-editor-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SurveyDetailsComponent,
    DashboardComponent,
    NavBarComponent,
    TabViewsComponent,
    PreviewComponent,
    NewTabViewDialog,
    SurveyEditorDashboardComponent,
    TabViewSearch,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgXformModule,
      BrowserAnimationsModule,
      MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule

  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}}
  ],
  exports: [
    NavBarComponent
  ],
    entryComponents: [NewTabViewDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }

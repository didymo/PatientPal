import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {DeployedLink} from './survey-editor/deployed-link';
import {MatInputModule} from '@angular/material/input';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DeployedSurveysComponent, DeployedSurveySearch} from './deployed-surveys/deployed-surveys.component';
import {OrderBy} from './tab-views/tab-views.component';
import {DraftViewComponent} from './draft-view/draft-view.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SurveyVersionListComponent } from './survey-version-list/survey-version-list.component';
import { BetaEditorComponent } from './beta-editor/beta-editor.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    SurveyDetailsComponent,
    DashboardComponent,
    NavBarComponent,
    TabViewsComponent,
    PreviewComponent,
    NewTabViewDialog,
    TabViewSearch,
      DeployedLink,
      DeployedSurveysComponent,
      DeployedSurveySearch,
      OrderBy,
      DraftViewComponent,
      BetaEditorComponent,
      SurveyVersionListComponent,
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
        MatSnackBarModule,
        MatInputModule,
        ScrollingModule,
        MatSlideToggleModule,
        MatProgressBarModule,
        NgbModule,
        DragDropModule,
        MatProgressSpinnerModule

    ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}}
  ],
  exports: [
    NavBarComponent
  ],
    entryComponents: [NewTabViewDialog, DeployedLink],
  bootstrap: [AppComponent]
})
export class AppModule { }

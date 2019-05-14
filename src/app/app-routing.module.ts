import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SurveysListComponent} from './surveys-list/surveys-list.component';
import {SurveyDetailsComponent} from './survey-details/survey-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/survey', pathMatch: 'full' },
  { path: 'detail/:id', component: SurveyDetailsComponent },
  { path: 'survey', component: SurveysListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

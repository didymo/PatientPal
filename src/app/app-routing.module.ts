import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SurveysListComponent} from './surveys-list/surveys-list.component';
import {SurveyDetailsComponent} from './survey-details/survey-details.component';
import {TabViewsComponent} from './tab-views/tab-views.component';

const routes: Routes = [
  // { path: '', redirectTo: '/survey', pathMatch: 'full' },
  {path: '', redirectTo: '/tab-views', pathMatch: 'full'},
  // { path: 'detail/:id', component: DynamicFormComponent },
  { path: 'detail/:id', component: SurveyDetailsComponent },
  { path: 'survey', component: SurveysListComponent },
  { path: 'tab-views', component: TabViewsComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

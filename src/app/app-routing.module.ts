import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SurveyDetailsComponent} from './survey-editor/survey-details.component';
import {TabViewsComponent} from './tab-views/tab-views.component';
import {PreviewComponent} from './preview/preview.component';
import {DeployedSurveysComponent} from './deployed-surveys/deployed-surveys.component';
import {DraftViewComponent} from './draft-view/draft-view.component';

const routes: Routes = [
  {path: '', redirectTo: '/tab-views', pathMatch: 'full'},
  { path: 'detail/:id', component: SurveyDetailsComponent },
  { path: 'tab-views', component: TabViewsComponent},
    {path: 'preview/:id', component: PreviewComponent},
  {path: 'deployed-surveys', component: DeployedSurveysComponent},
    {path: 'drafts', component: DraftViewComponent},


];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SurveyDetailsComponent} from './survey-editor/survey-details.component';
import {TabViewsComponent} from './tab-views/tab-views.component';
import {PreviewComponent} from './preview/preview.component';

const routes: Routes = [
  {path: '', redirectTo: '/tab-views', pathMatch: 'full'},
  { path: 'detail/:id', component: SurveyDetailsComponent },
  { path: 'tab-views', component: TabViewsComponent},
    {path: 'preview/:id', component: PreviewComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

import { Component, OnInit } from '@angular/core';
import {SurveyService} from '../Services/survey.service';
import { Tabview} from '../tabview';
import {Survey} from '../Survey';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tab-views',
  templateUrl: './tab-views.component.html',
  styleUrls: ['./tab-views.component.css']
})
export class TabViewsComponent implements OnInit {
  tabviews: Tabview [];
  tabviews$: Observable<Tabview[]>;

  constructor(private surveyService: SurveyService) { }

  ngOnInit() {
    this.getTabViews();
  }
  /**
   * Gets tab views
   */
  getTabViews() {
    this.surveyService.getTabViewList()
        .subscribe(data => this.tabviews = data);
  }

}

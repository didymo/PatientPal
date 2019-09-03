import { Component, OnInit } from '@angular/core';
import {SurveyService} from '../_Services/survey.service';
import {TabviewList} from '../TabviewList';

@Component({
  selector: 'app-tab-views',
  templateUrl: './tab-views.component.html',
  styleUrls: ['./tab-views.component.css']
})

/**
 * Used to display a list of Tabviews that have been imported from Drupal
 * This component is the homepage of the application
 * From here, users can navigate into the survey editor by clicking on one of the tab views
 */
export class TabViewsComponent implements OnInit {
    /**
     * An array of TabViews
     * The array will be used to output all the TabViews in a table
     */
    tabviews: TabviewList [];

    /**
     * Constructor of the TabViewComponent Class
     * @param surveyService
     * The service class used to interface with Drupal
     */
    constructor(private surveyService: SurveyService) { }

    /**
     * NgOnInit function
     */
    ngOnInit() {
        this.getTabViews();
    }
  /**
   * Calls the getTabViewList function which returns a list of all the tab views stored in Drupal
   */
  getTabViews() {
    this.surveyService.getTabViewList()
        .subscribe(data => this.tabviews = data);
  }
}

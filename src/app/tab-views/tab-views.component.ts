import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {SurveyService} from '../_services/survey.service';
import {TabviewList} from '../_classes/TabviewList';

@Pipe({
    name: 'tabViewSearch'
})
/**
 * Used to handle the search functionality of the application
 * Searches for specific TabViews
 * Displays a search bar on the application
 * A user can enter search terms and then see any TabView with similar characters
 */
export class TabViewSearch implements PipeTransform {


    transform(value: TabviewList[], term: string): TabviewList[] {
        if (term == null) {
            return value;
        } else {
            return value.filter(item => item.label.toLowerCase().match(term.toLowerCase()));
        }
    }

}

@Component({
    selector: 'app-tab-views',
    templateUrl: './tab-views.component.html',
    styleUrls: ['./tab-views.component.css'],
    providers: [TabViewSearch]
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
    queryString: string;

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

  getTabViewVersion(id: number) {
    var versions: number[];
    this.surveyService.getTabViewVersion(id)
    .subscribe(data => versions = data);
  }
}

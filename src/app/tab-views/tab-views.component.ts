import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {SurveyService} from '../_services/survey.service';
import {TabviewList} from '../_classes/TabviewList';

@Pipe({
    name: 'tabViewSearch'
})
/**
 * Handles the sorting by views in the table
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

@Pipe({
    name: 'orderBy'
})
/**
 * Handles the sorting by views in the table
 */
export class OrderBy implements PipeTransform {
    /**
     * Compare function
     * @param a
     * @param b
     */
    compare(a: any, b: any): number {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    transform(value: TabviewList[], term: string): TabviewList[] {
        if (term == null) {
            return value;
        }
        switch (term) {
            case 'ID':
                return value.sort((a, b) => {
                    let itemA = a.entityId;
                    let itemB = b.entityId;
                    return this.compare(itemA, itemB);
                });
            case 'IDBack':
                return value.sort((a, b) => {
                    let itemA = b.entityId;
                    let itemB = a.entityId;
                    return this.compare(itemA, itemB);
                });
            case 'Label':
                return value.sort((a, b) => {
                    let itemA = b.label.toLowerCase().replace(/\s/g, '');
                    let itemB = a.label.toLowerCase().replace(/\s/g, '');
                    return this.compare(itemA, itemB);
                });
            case 'LabelBack':
                return value.sort((a, b) => {
                    let itemA = a.label.toLowerCase().replace(/\s/g, '');
                    let itemB = b.label.toLowerCase().replace(/\s/g, '');
                    return this.compare(itemA, itemB);
                });
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
    sortString: string;

    orderId: boolean;
    orderName: boolean;

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

    public tableSort(): void {
        this.orderId = !this.orderId;

        if (this.orderId == false) {
            this.sortString = 'ID';
        } else {
            this.sortString = 'IDBack';
        }
    }

    public nameSort(): void {
        this.orderName = !this.orderName;

        if (this.orderName == false) {
            this.sortString = 'Label';
        } else {
            this.sortString = 'LabelBack';
        }
    }
}

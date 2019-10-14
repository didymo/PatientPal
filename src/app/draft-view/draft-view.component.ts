import {Component, OnInit} from '@angular/core';
import {TabviewList} from '../_classes/TabviewList';
import {SurveyService} from '../_services/survey.service';
import {TabViewSearch, OrderBy,} from '../tab-views/tab-views.component';

@Component({
    selector: 'app-draft-view',
    templateUrl: './draft-view.component.html',
    styleUrls: ['./draft-view.component.css']
})
export class DraftViewComponent implements OnInit {

    tabviews: TabviewList [];
    drafts: TabviewList [] = [];
    queryString: string;
    sortString: string;

    orderId: boolean;
    orderName: boolean;

    /**
     * Constructor of the DraftViewComponent Class
     * @param surveyService
     * The service class used to interface with Drupal
     */
    constructor(private surveyService: SurveyService) {
    }

    ngOnInit() {
        this.getDrafts();
    }

    /**
     * Retrieves Tab view list
     */
    public getDrafts() {
        this.surveyService.getTabViewList()
            .subscribe(
                data => this.tabviews = data,
                err => console.log(err),
                () => this.sortDrafts()
            );
    }

    /**
     * Removes any tab view that is not a draft
     */
    public sortDrafts() {
        this.tabviews.forEach((item, index, array) => {
            if (item.revisionStatus == 'Published') {

            } else {
                this.drafts.push(item);
            }
        });
    }

    /**
     * Handles the table sort based on the ID
     */
    public tableSort(): void {
        this.orderId = !this.orderId;

        if (this.orderId == false) {
            this.sortString = 'ID';
        } else {
            this.sortString = 'IDBack';
        }
    }

    /**
     * Deals with the sorting of names in the table
     */
    public nameSort(): void {
        this.orderName = !this.orderName;

        if (this.orderName == false) {
            this.sortString = 'Label';
        } else {
            this.sortString = 'LabelBack';
        }
    }

}

import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import {SurveyService} from '../Services/survey.service';
import {TabviewList} from '../TabviewList';

@Component({
  selector: 'app-survey-search',
  templateUrl: './survey-search.component.html',
  styleUrls: ['./survey-search.component.css']
})

/**
 * Used to handle the search functionality of the application
 * Searches for specific TabViews
 * Displays a search bar on the application
 * A user can enter search terms and then see any TabView with similar characters
 */
export class SurveySearchComponent implements OnInit {

    /**
     * An array of TabViewList
     * Stores TabViewList based on if they match a specfic 'term' that the user has inputed
     */
    surveys$: Observable<TabviewList[]>;
    /**
     * The actual term that a user has inputed into the search bar
     */
  private searchTerms = new Subject<string>();

    /**
     * Constructor for the SurveySearchComponent
     * @param surveyService
     * The service class that interfaces with Druapl
     */
    constructor(private surveyService: SurveyService) { }


    /**
     * Push a search term into the observable stream.
     * @param term
     * The search term
     */
  search(term: string): void {
    this.searchTerms.next(term);
  }

    /**
     * ngOnInit for SurveySearchComponent
     */
    ngOnInit() {
        this.surveys$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((term: string) => this.surveyService.searchSurveys(term)),
        );
    }

}

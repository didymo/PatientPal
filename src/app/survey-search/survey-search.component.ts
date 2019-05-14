import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Survey } from '../survey';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-survey-search',
  templateUrl: './survey-search.component.html',
  styleUrls: ['./survey-search.component.css']
})
export class SurveySearchComponent implements OnInit {

  surveys$: Observable<Survey[]>;
  private searchTerms = new Subject<string>();

  constructor(private surveyService: SurveyService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

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

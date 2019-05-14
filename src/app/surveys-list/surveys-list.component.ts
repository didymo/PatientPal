import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Survey } from '../survey';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.css']
})
export class SurveysListComponent implements OnInit {

  surveys: Survey [];
  constructor(private surveyService: SurveyService) { }

  surveys$: Observable<Survey[]>;
  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.getSurveys();
  }
  getSurveys(): void {
    this.surveyService.getSurveys()
      .subscribe(surveys => this.surveys = surveys);
  }

  /**
   * Takes a string name, and appends a new survey
   * @param name
   */
  createSurvey(name: string) {
    name = name.trim();
    if (!name) { return; }
    this.surveyService.addSurvey({ name } as Survey)
      .subscribe(project => {this.surveys.push(project);
      });
  }

  deleteSurvey(id: number) {
    if(!id) { return; }

    this.surveys = this.surveys.filter(h => h.id !== id);
    this.surveyService.deleteSurvey(id).subscribe();
  }

  /**
   * Will be used to make the dynamic search views
   */
  onSearch(): void {
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

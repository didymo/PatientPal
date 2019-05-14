import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Survey } from './survey';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private surveysURL = 'api/surveys';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
  }

  /** POST: add a new project to the server */
  /**
   * @param survey
   */
  addSurvey(survey: Survey): Observable<Survey> {
    // project.creation_date = new Date();
    // project.modified_date = new Date();
    // project.status = ProjectStatus.draft;
    return this.http.post<Survey>(this.surveysURL, survey, httpOptions).pipe(
      tap((newSurvey: Survey) => this.log(`added survey w/ id=${survey.id}`)),
      catchError(this.handleError<Survey>('addSurvey')));
  }

  /**
   *
   * @param survey
   */
  deleteSurvey(survey: Survey | number): Observable<Survey> {
    const id = typeof survey === 'number' ? survey : survey.id;
    const url = `${this.surveysURL}/${id}`;

    return this.http.delete<Survey>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted survey id=${id}`)),
      catchError(this.handleError<Survey>('deleteSurvey')));
  }

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.surveysURL)
      .pipe(
        tap(_ => this.log('fetched surveys')),
        catchError(this.handleError<Survey[]>('getSurveys', []))
      );
  }

  /** GET survey by id. Will 404 if id not found */
  getSurvey(id: number): Observable<Survey> {
    const url = `${this.surveysURL}/${id}`;
    return this.http.get<Survey>(url).pipe(
      tap(_ => this.log(`fetched survey id=${id}`)),
      catchError(this.handleError<Survey>(`getSurvey id=${id}`))
    );
  }

  searchSurveys(term: string): Observable<Survey[]> {
    if (!term.trim()) {
      // if not search term, return empty survey array.
      return of([]);
    }
    return this.http.get<Survey[]>(`${this.surveysURL}/?name=${term}`).pipe(
      tap(_ => this.log(`found survey matching "${term}"`)),
      catchError(this.handleError<Survey[]>('searchSurveys', []))
    );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** PUT: update the survey on the server */
  updateSurvey (survey: Survey): Observable<any> {
    return this.http.put(this.surveysURL, survey, httpOptions).pipe(
      tap(_ => this.log(`updated survey id=${survey.id}`)),
      catchError(this.handleError<any>('updateSurvey'))
    );
  }
  /** Log a SurveyService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SurveyService: ${message}`);
  }
}

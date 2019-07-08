import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Survey } from './survey';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import {Tabview} from './tabview';
import {QuestionType} from './QuestionType';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    private surveysURL = 'api/surveys';  // URL to web api
    private drupalURL = 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/tab/list?_format=json';
    private tabViewURL = 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/content/tab/get/';
    constructor(
        private http: HttpClient,
        private messageService: MessageService) {
    }

    /**
     * GET TabViewList from drupal
     * Will return 404 if not found
     */
    getTabViewList(): Observable<Tabview[]> {
        return this.http.get<Tabview[]>(this.drupalURL)
            .pipe(
                tap(_ => this.log('fetched tabViews')),
                catchError(this.handleError<Tabview[]>('getTabViewList', []))
            );
    }

    /**
     * Returns tab view and the questions from the tab view
     * @param ID
     * GET request to druapl using the entityId associated with the tab view
     */
    getTabView(ID: number): Observable<QuestionType[]> {
        const url = `${this.tabViewURL}${ID}/${'?_format=json'}`;
        return this.http.get<QuestionType[]>(url)
            .pipe(
                tap(_ => this.log('fetched tabViews')),
                catchError(this.handleError<QuestionType[]>('getTabViewList', []))
            );
    }

    /** POST: add a new project to the server */
    /**
     * @param survey
     * Survey is a tab view
     */
    addSurvey(survey: Survey): Observable<Survey> {
        return this.http.post<Survey>(this.surveysURL, survey, httpOptions).pipe(
            tap((newSurvey: Survey) => this.log(`added survey w/ id=${survey.id}`)),
            catchError(this.handleError<Survey>('addSurvey')));
    }

    /**
     * Deletes a survey
     * @param survey
     * s
     */
    deleteSurvey(survey: Survey | number): Observable<Survey> {
        const id = typeof survey === 'number' ? survey : survey.id;
        const url = `${this.surveysURL}/${id}`;

        return this.http.delete<Survey>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted survey id=${id}`)),
            catchError(this.handleError<Survey>('deleteSurvey')));
    }

    /**
     * Get surveys
     */
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

    /**
     * Search Surveys
     * @param term
     * The search term
     */
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
    updateSurvey(survey: Survey): Observable<any> {
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

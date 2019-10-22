import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import {TabviewList} from '../_classes/TabviewList';
import {TabView} from '../_classes/TabView';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZGlkeW1vYWRtaW46bXlwYXNzd29yZA=='
    })
};

@Injectable({
    providedIn: 'root'
})
export class SurveyService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService) {
    }

    /**
     * GET TabViewList from drupal
     * Will return 404 if not found
     */
    getTabViewList(): Observable<TabviewList[]> {
        return this.http.get<TabviewList[]>(environment.drupalURL, httpOptions)
            .pipe(
                tap(_ => this.log('fetched tabViews')),
                catchError(this.handleError<TabviewList[]>('getTabViewList', []))
            );
    }

    /**
     * Returns tab view and the questions from the tab view
     * @param ID
     * GET request to druapl using the entityId associated with the tab view
     */
    getTabView(ID: number): Observable<TabView> {
        const url = `${environment.tabViewURL}${ID}/${'?_format=json'}`;
        return this.http.get<TabView>(url, httpOptions)
            .pipe(
                tap(_ => this.log('fetched tabViews')),
                catchError(this.handleError<TabView>('getTabViewList', ))
            );
    }

    /** PATCH: add a new project to drupal */
    /**
     * @param survey
     * The payload
     */
    addSurvey(payload: string): Observable<any> {
        console.log(payload);
        return this.http
            .patch<string>(environment.surveysURL, payload, httpOptions)
            .pipe(
                tap(_ => this.log(`updated Survey id`)),
                catchError(this.handleError<any>('addSurvey', payload))
            );
    }

    /** PATCH: Publish a survey to drupal */
    /**
     * @param survey
     * The payload
     */
    publishSurvey(payload: string): Observable<any> {
        console.log(payload);
        return this.http
            .patch<string>(environment.publishURL, payload, httpOptions)
            .pipe(
                tap(_ => this.log(`Survey Published`)),
                catchError(this.handleError<any>('Publish', payload))
            );
    }

    deploySurvey(payload: string, hash: string): Observable<any> {
        console.log(payload);
        const url = `${environment.formServerURL}${hash}`;
        return this.http
            .post<string>(url, payload, httpOptions)
            .pipe(
                tap(_ => this.log(`Deployed Survey`)),
                catchError(this.handleError<any>('addSurvey', payload))
            )
    }

    /**
     * Search Surveys
     * @param term
     * The search term
     */
    searchSurveys(term: string): Observable<TabviewList[]> {
        if (!term.trim()) {
            // if not search term, return empty survey array.
            return of([]);
        }
        return this.http.get<TabviewList[]>(`${environment.drupalURL}/?label=${term}`)
            .pipe(
                tap(_ => this.log(`found survey matching "${term}"`)),
                catchError(this.handleError<TabviewList[]>('searchSurveys', []))
        );
    }

    /**
     * GET TabViewList from drupal
     * Will return 404 if not found
     */
    getDeployedForms(): Observable<any> {
        return this.http.get<any>(environment.formServerDeployed)
            .pipe(
                tap(_ => this.log('fetched deployed')),
                catchError(this.handleError<any>('getDeployedSurveys', ))
            );
    }
    /**
     * GET TabViewList from drupal
     * Will return 404 if not found
     */
    getDeployedSurvey(ID: number): Observable<string> {
            const url = `${environment.formServerURL}${ID}/${'?_format=json'}`;
            return this.http.get<string>(url)
                .pipe(
                    tap(_ => this.log('fetched tabViews')),
                    catchError(this.handleError<string>('getTabViewList', ))
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
    /** Log a SurveyService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`SurveyService: ${message}`);
    }
}

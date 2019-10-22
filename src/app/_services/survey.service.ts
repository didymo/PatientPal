import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import {TabviewList} from '../_classes/TabviewList';
import {TabView} from '../_classes/TabView';
import {TabViewVersion} from '../_classes/TabViewVersion';
import {TabViewVersionInfo} from '../_classes/TabViewVersionInfo';
import {DeployedSurvey} from '../_classes/DeployedSurvey';

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
    /**
     * Returns tab view versions list for a specific TabView
     * @param ID
     * GET request to druapl using the entityId associated with the tab view
     */
    getTabViewVersions(ID: number): Observable<TabViewVersion[]> {
        const url = `${environment.versionURL}${ID}/${'?_format=json'}`;
        console.log(ID);
        return this.http.get<TabViewVersion[]>(url)
            .pipe(
                tap(_ => this.log('fetched tabView versions for ' + ID)),
                map(ver => this.getVersionInfo(ver,ID)),
                //catchError(this.handleError<TabViewVersion[]>('getTabViewVersions', []))
            );
    }

    private getVersionInfo(ver: any[], tabid: number): TabViewVersion[]
    {
        let re = [];

        let keys = Object.keys(ver);

        //get all elements of ver
        for (let i = 0; i < keys.length;i++)
        {
            let versioninfo = ver[keys[i]];
            //if (versioninfo["revisionStatus"] == null)
            //versioninfo["revisionStatus"] = "Unknown";
            versioninfo["id"] = keys[i];
            versioninfo["tabid"] = tabid;
            if (versioninfo["revisionStatus"] != null)
            re.push(versioninfo);
        }

        return re;
    }
    
    /**
     * Returns information about a single version
     * @param ID
     * GET request to druapl using the revision ID associated with the version
     */
     getTabViewVersionInfo(ID: number): Observable<TabViewVersionInfo> {
        const url = `${environment.tabViewVersionURL}${ID}/${'?_format=json'}`;
        console.log(ID);
        return this.http.get<TabViewVersionInfo>(url)
            .pipe(
                tap(_ => this.log('fetched tabView versions for ' + ID)),
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
    getDeployedSurveys(): Observable<string[]> {
        return this.http.get<string[]>(environment.formServerDeployed)
            .pipe(
                tap(_ => this.log('fetched deployed')),
                catchError(this.handleError<string[]>('getDeployedSurveys', []))
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

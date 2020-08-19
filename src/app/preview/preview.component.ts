import {Component, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';
import {Title} from '@angular/platform-browser';
import {of, Subject, Subscription} from 'rxjs';
import {Validators} from '@angular/forms';
import {delay} from 'rxjs/operators';
import {BuildFormService} from '../_services/build-form.service';
import {TabView} from '../_classes/TabView';
import {Assessment} from '../_classes/Assessment';



@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
/**
 * Handles the previewing of Surveys
 * When a user is editing a survey this component will display what the actual question will look like
 * @author Peter Charles Sims
 */
export class PreviewComponent implements OnInit {

    tabView: TabView;

    /**
     * Need a new TabView to put the values, not using the old name for now.
     */
    currentTabView: TabView;

    private self: boolean;

    public onchangefn = new Subject<string>();

    /**
     * Determine if a form is horizontal viewing or not
     */
    public horizontal = true;
    /**
     * Defines the width of a label
     */
    public labelWidth = 0
    public model: any;
    public outputhelper = {A: 1, B: 2, C: 3};
    public subscriptions: Subscription[] = [];

    docHTML = '';
    private tmpAssessments: Assessment;

    /**
     * Constructor for PreviewComponent
     * @param titleService
     * Used to set the title of the window
     * @param fbService
     * Retrieve surveys from component
     */
    constructor(
        private titleService: Title,
        private fbService: BuildFormService
    ) { }

    /**
     * ngOnInit for PreviewComponent
     */
    ngOnInit() {

        this.tabView = this.fbService.getSurvey();

        /**
        this.subscriptions.push(this.onchangefn.asObservable().subscribe(
            (value: any) =>  this.xformComponent.setValue({outputopt: this.outputhelper[value]})
        ));
        **/
        this.titleService.setTitle('TabviewList | ' + this.tabView.tabViewLabel); // Sets the title
    }


}

import {Component, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';
import {Title} from '@angular/platform-browser';
import {of, Subject, Subscription} from 'rxjs';
import {Validators} from '@angular/forms';
import {delay} from 'rxjs/operators';
import {BuildFormService} from '../_services/build-form.service';
import {TabView} from '../_classes/TabView';
import {Assessment} from '../_classes/Assessment';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


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
    public onchangefn = new Subject<string>();

    /**
     * Determine if a form is horizontal viewing or not
     */
    public horizontal = true;
    /**
     * Defines the width of a label
     */
    public labelWidth = 0;
    public subscriptions: Subscription[] = [];
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
    ) {
    }

    /**
     * ngOnInit for PreviewComponent
     */
    ngOnInit() {

        this.tabView = this.fbService.getSurvey();

        this.titleService.setTitle('TabviewList | ' + this.tabView.label); // Sets the title
    }


}

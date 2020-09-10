import {Component} from '@angular/core';
import {BuildFormService} from '../_services/build-form.service';
import {TabView} from '../_classes/TabView';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
/**
 * Handles the previewing of Surveys
 * When a user is editing a survey this component will display what the actual survey will look like.
 * @author Peter Charles Sims
 */
export class PreviewComponent {

    /**
     * The currently selected TabView.
     *
     * {@type {TabView}
     */
    public tabView: TabView;

    /**
     * Constructor for PreviewComponent
     * @param fbService
     * Retrieve surveys from component
     */
    constructor(private fbService: BuildFormService) {
        this.tabView = this.fbService.getSurvey();
    }
}

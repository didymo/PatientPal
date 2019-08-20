import {Component, OnInit, Input, Output, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Survey } from '../Survey';
import {SurveyService} from '../Services/survey.service';
import {TabView} from '../TabView';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {PreviewComponent} from '../preview/preview.component';

@Component({
    selector: 'app-form-details',
    templateUrl: './survey-details.component.html',
    styleUrls: ['./survey-details.component.css']
})
/**
 * @implements OnInit
 * This class will handle the process of viewing a survey's questions, and editing them
 * Users will use the to edit their questions, save those questions, and then either publish/draft them
 */
export class SurveyDetailsComponent implements OnInit {
    /**
     * Stores an instance of the preview component
     */
    @ViewChild(PreviewComponent) preview;
    /**
     * The id from the URL is linked to the entity ID of the tabview
     */
    private id = +this.route.snapshot.paramMap.get('id');
    /**
     * Stores an array of TabViews that have been imported from Drupal
     */
    private tabViews: TabView [];
    /**
     * An instance of a Survey
     */
    private survey: Survey;

    /**
     * Constructor for the SurveyDetailsComponent Class
     * @param fb FromBuilder
     * @param route Activated Route
     * @param formService The service class that inferfaces with Drupal
     * @param location Instance of Location
     */
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private formService: SurveyService,
        private location: Location
    ) { }
    /**
     * NgInit for the SurveyDetailComponent Class
     */
    ngOnInit() {
        this.getTabView();
    }

    /**
     * GET tab views
     * Async task that uses the service class to interface with Drupal
     * Retrieved data from drupal is then stored into an array of TabViews
     * Once completed, the TabViews are then sorted into the Survey Class
     */
    public getTabView() {
        this.formService.getTabView(this.id)
            .subscribe(
                data => this.tabViews = data, // Move data into TabView
                err => console.log(err), // Log any Errors
                () => this.sortSurvey()); // Sort tabviews into a Survey
    }
    /**
     * Returns a user back to the previous page
     */
    public goBack(): void {
        this.location.back();
    }
    /**
     * Sorts out the tabviews that were retrieved from Drupal
     * Creates assessments and their choices by iterating through the tabviews
     * Once an assessment is created and it's choices have been populated
     * Then it is added into the Survey
     */
    public sortSurvey(): void {
        this.createSurvey(); // init survey

        let tempAssessment: Assessment; // Create a temporary
        let i = 0; // Iterates through the tab view
        let j = 0; // Iterates through the assessment choices

        for (i; i < this.tabViews.length; i++) {
            tempAssessment = this.createAssessment(i); // Create a new assessment
            if (this.tabViews[i].assessmentType.toString() === '4') {
                tempAssessment.addChoice(this.createChoice(i, 4)); // Add a single choice to an assessment
            } else if (this.tabViews[i].assessmentType.toString() === '5') {
                j = i; // index of the choice
                while (this.tabViews[j].assessmentId === this.tabViews[i].assessmentId) {
                    tempAssessment.addChoice(this.createChoice(j, 5)); // Add a single a choice to an assessment
                    j++;
                }
                i = j; // Update new position of i
            }
            this.survey.addAssessment(tempAssessment); // Add the assessment to the survey
        }
    }
    /**
     * Creates a new choice based on the assessment type
     * @param i
     * Index of the array
     * @type
     * The assessment type
     */
    public createChoice(i: number, type: number): Choice {
        let tempChoices: Choice; // Create temp choice
        /** Creates a default choice*/
        if (type === 4) {
            tempChoices = new Choice(
                4,
                'Type 4'
            );
            return tempChoices;
        } else {
            /** Creates a normal choice*/
            tempChoices = new Choice(
                this.tabViews[i].choiceId,
                this.tabViews[i].choiceLabel
            );
        }
        return tempChoices;
    }

    /**
     * Creates a new survey
     */
    public createSurvey(): void {
        this.survey = new Survey(
            this.tabViews[0].tabViewId,
            this.tabViews[0].tabViewLabel
        );
    }
    /**
     * Init temp assessment
     * @param i
     * Index of the array
     */
    public createAssessment(i: number): Assessment {
        const tempAssessment = new Assessment(
            this.tabViews[i].assessmentId,
            this.tabViews[i].assessmentType,
            this.tabViews[i].assessmentLabel.trim()
        );
        return tempAssessment;
    }
    /**
     * Saves, and submits the data to Drupal
     * Generates a JSON string
     * Calls addSurvey from the service class to interface with Drupal
     */
    public submit(): void {
        this.saveSurvey(); // Save any updated fields
        const payload = JSON.stringify(this.survey); // Generate a payload
        this.formService
            .addSurvey(payload) // Add the survey
            .subscribe(
                res => {
                    console.log(res);
                },
                error1 => console.log(error1) // Log errors
            );
    }

    /**
     * Updates the values within survey
     * Iterates through the input tags and sets the assessments/choices description to those values
     */
    public saveSurvey(): void {
        let i = 0; // Holds the position of the assessments
        let x = 0; // Holds the position of the choices
        for (i; i < this.survey.assessments.length; i++) {
            this.survey.assessments[i].setAssessmentDescription(
                (document.getElementById(this.survey.assessments[i].id.toString()) as HTMLInputElement).value); // Value in the input tag
            for (x = 0; x < this.survey.assessments[i].choices.length; x++) {
                try {
                    this.survey.assessments[i].choices[x].setChoiceDescription(
                        (document.getElementById(this.survey.assessments[i].choices[x].id.toString()) as HTMLInputElement).value);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    /**
     * When user clicks save question, all question choices are then saved
     */
    public saveQuestion(i: number): void {
        this.saveSurvey(); // Save the survey
        this.preview.updateField(i); // Update the preview
    }
}
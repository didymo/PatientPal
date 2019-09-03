import {Component, OnInit, Input, Output, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Survey } from '../Survey';
import {SurveyService} from '../_Services/survey.service';
import {TabView} from '../TabView';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {PreviewComponent} from '../preview/preview.component';
import {ExcelService} from '../_Services/excel.service';
import {Worksheet} from '../Worksheet';


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
    @ViewChild(PreviewComponent, {static: false}) preview;
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
        private excelService: ExcelService,
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
        this.createSurvey(); // Create an instance of a survey

        let tempAssessment: Assessment; // Create an instance of an assessment
        let i = 0; // Holds position of choices
        let j = 0; // Holds position of assessment

        this.tabViews.forEach((item, index, array) => {
            if (index === 0) { // Default statement
                tempAssessment = this.createAssessment(index); // Create a new assessment
                this.survey.addAssessment(tempAssessment);
                if (item.assessmentType.toString() === '4') {
                    this.survey.assessments[j].addChoice(this.createChoice(index, 4)); // Add a single choice to an assessment
                } else if (item.assessmentType.toString() === '5') {
                    this.survey.assessments[j].addChoice(this.createChoice(i, 5)); // Add a single a choice to an assessment
                    i++;
                }
            } else if (item.assessmentType.toString() === '4') {
                tempAssessment = this.createAssessment(index); // Create a new assessment
                tempAssessment.addChoice(this.createChoice(index, 4)); // Add a single choice to an assessment
                this.survey.addAssessment(tempAssessment);
                j++;
            } else if (item.assessmentType.toString() === '5' && item.assessmentId === this.tabViews[index - 1].assessmentId) {
                this.survey.assessments[j].addChoice(this.createChoice(index, 5)); // Add a single a choice to an assessment
                i++;
            } else if (item.assessmentType.toString() === '5' && item.assessmentId !== this.tabViews[index - 1].assessmentId) {
                i = 0;
                tempAssessment = this.createAssessment(index); // Create a new assessment
                tempAssessment.addChoice(this.createChoice(index, 5)); // Add a single a choice to an assessment
                this.survey.addAssessment(tempAssessment);
                j++;
            }
        });

        let blob = this.excelService.getExcelData();
        if (blob !== undefined) {
            this.updateToExcel(blob);
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
                this.tabViews[i].choiceDescription.trim()
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
            this.tabViews[i].assessmentDescription.trim()
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

        this.survey.assessments.forEach(function(item, index, array) {
            item.setAssessmentDescription(
                (document.getElementById(item.id.toString()) as HTMLInputElement).value); // Value in the input tag
            item.choices.forEach(function(choice, index, array) {
                try {
                    choice.setChoiceDescription(
                        (document.getElementById(choice.id.toString()) as HTMLInputElement).value);
                } catch (e) {
                    console.log(e);
                }
            })
        })
    }

    /**
     * When user clicks save question, all question choices are then saved
     */
    public saveQuestion(i: number, optional: boolean): void {
        this.saveSurvey(); // Save the survey
        this.preview.updateField(i, optional); // Update the preview
    }

    /**
     * Creates an instance of Worksheet
     * @return Worksheet
     * Returns worksheet to be used for the exporting of XLSX files
     */
    public createWorksheet(): Worksheet[] {

        let worksheet = this.tabViews.map((tabview) => {
            let obj = new Worksheet(
                tabview.tabViewLabel,
                tabview.tabViewId,
                tabview.assessmentId,
                tabview.assessmentDescription,
                tabview.assessmentType,
                tabview.assessmentLabel,
                tabview.choiceId,
                tabview.choiceDescription,
                tabview.choiceLabel
            );
            return obj;
        });

        return worksheet;
    }

    exportAsXLSX(): void {
        this.excelService.exportExcelFile(this.createWorksheet(), this.tabViews[0].tabViewLabel);
    }

    /**
     * This funciton updates the survey class based on the data from the imported XLSX files
     * @param blob
     * A json string from the XLSX file
     */
    public updateToExcel(blob: any []) {

        let i = 0; // Holds the position of the assessments
        let j = 0; // Holds the position of the choices

        blob.forEach((item, index, array) => {
            if (index === 0) {
                this.survey.assessments[i].setAssessmentDescription(item.assessmentDescription.toString());
                if (item.assessmentType.toString() === '4') {
                    this.survey.assessments[i].setAssessmentDescription(item.assessmentDescription.toString());
                    i++; // Update the position of the assessment
                } else if (item.assessmentType.toString() === '5') {
                    this.survey.assessments[i].choices[j].setChoiceDescription(item.choiceDescription.toString());
                    j++; // Update the position of the choice
                }
            } else if (item.assessmentType.toString() === '4') {
                this.survey.assessments[i].setAssessmentDescription(item.assessmentDescription.toString());
                i++; // Update the position of the assessments
            } else if (item.assessmentType.toString() === '5' && this.survey.assessments[i].id === item.assessmentId) {
                this.survey.assessments[i].choices[j].setChoiceDescription(item.choiceDescription.toString());
                j++; // Update the position of the choice
            } else if (item.assessmentType.toString() === '5' && this.survey.assessments[i].id !== item.assessmentId) {
                j = 0; // Reset values
                i++; // Move onto the next assessment
                this.survey.assessments[i].setAssessmentDescription(item.assessmentDescription.toString());
                this.survey.assessments[i].choices[j].setChoiceDescription(item.choiceDescription.toString());
                j++; // Update the position of the choice
            }

        })
    }
}

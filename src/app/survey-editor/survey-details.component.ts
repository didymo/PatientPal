import {Component, OnInit, Input, Output, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {Survey} from '../_classes/Survey';
import {SurveyService} from '../_services/survey.service';
import {TabView} from '../_classes/TabView';
import {Assessment} from '../_classes/Assessment';
import {Choice} from '../_classes/Choice';
import {PreviewComponent} from '../preview/preview.component';
import {ExcelService} from '../_services/excel.service';
import {Worksheet} from '../_classes/Worksheet';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {DeployedLink} from './deployed-link';
import {environment} from '../../environments/environment';
import {BuildFormService} from '../_services/build-form.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface DialogData {
    link: string;
}

@Component({
    selector: 'app-form-details',
    templateUrl: './survey-details.component.html',
    styleUrls: ['./survey-details.component.css'],
    providers: [MatSnackBar],
    animations: [
        trigger('openClose', [
            state('open', style({
                width: '100%'
            })),
            state('closed', style({
                width: '50%'
            })),
            transition('open => closed', [
                animate('0.3s')
            ]),
            transition('closed => open', [
                animate('0.3s')
            ]),
        ]),
        trigger('openPreview', [
            state('hidden', style({
                display: 'none'
            })),
            state('visible', style({
                display: 'block'
            })),
        ]),
        trigger('fullPreview', [
            state('open', style({
                width: '100%'
            })),
            state('closed', style({
                width: '0%'
            })),
            transition('open => closed', [
                animate('0.3s')
            ]),
            transition('closed => open', [
                animate('0.3s')
            ]),
        ]),
    ],
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

    disabled = false;
    checked = false;
    isOpen = true;
    isPreview = false;

    /**
     * Constructor for the SurveyDetailsComponent Class
     * @param fb FromBuilder
     * @param route Activated Route
     * @param formService The service class that inferfaces with Drupal
     * @param excelService
     * @param location Instance of Location
     * @param _snackBar
     */
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private formService: SurveyService,
        private excelService: ExcelService,
        private location: Location,
        private fbService: BuildFormService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog
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
     * Sorts out the tabviews that were retrieved from Drupal
     * Creates assessments and their choices by iterating through the tabviews
     * Once an assessment is created and it's choices have been populated
     * Then it is added into the Survey
     */
    public sortSurvey(): void {
        this.createSurvey(); // Create an instance of a survey
        let assessmentType: string;
        let tempAssessment: Assessment; // Create an instance of an assessment
        let cPos = 0; // Holds position of choices
        let aPos = 0; // Holds position of assessment

        this.tabViews.forEach((item, index, array) => {
            assessmentType = item.assessmentType.toString();
            if (index === 0) { // Default statement

                tempAssessment = this.createAssessment(index); // Create a new assessment
                this.survey.addAssessment(tempAssessment);
                if (assessmentType === '4') {
                    this.survey.assessments[aPos].addChoice(this.createChoice(index, 4)); // Add a single choice to an assessment
                } else if (assessmentType === '5') {
                    this.survey.assessments[aPos].addChoice(this.createChoice(cPos, 5)); // Add a single a choice to an assessment
                    cPos++; // Update the position of the choice
                }
            } else if (assessmentType === '4') {
                tempAssessment = this.createAssessment(index); // Create a new assessment
                tempAssessment.addChoice(this.createChoice(index, 4)); // Add a single choice to an assessment
                this.survey.addAssessment(tempAssessment);
                aPos++; // Update the position of the assessment
            } else if (assessmentType === '5' && item.assessmentId === this.tabViews[index - 1].assessmentId) {
                this.survey.assessments[aPos].addChoice(this.createChoice(index, 5)); // Add a single a choice to an assessment
                cPos++; // Update the position of the choice
            } else if (assessmentType === '5' && item.assessmentId !== this.tabViews[index - 1].assessmentId) {
                cPos = 0; // Reset the position of the choice
                tempAssessment = this.createAssessment(index); // Create a new assessment
                tempAssessment.addChoice(this.createChoice(index, 5)); // Add a single a choice to an assessment
                this.survey.addAssessment(tempAssessment); // Add the assessment to the survey
                aPos++; // Update the position of the assessment
            }
        });

        // Check if an excel file is present
        let blob = this.excelService.getExcelData();
        if (blob !== undefined) {
            this.updateToExcel(blob);
            this.openSnackBar('Import Successful', 'Close');
        }

        this.setSurveyData(false);
    }

    /**
     * Creates a new choice based on the assessment type
     * @param i
     * Index of the array
     * @param type
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
                this.tabViews[i].choiceLabel.trim()
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
     * Create a new assessment
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
        this.openSnackBar('Survey Submitted', 'Close');

    }

    /**
     * Saves, the questions, and sends a POST request to the formserver
     * Generates a JSON string
     * Calls deploy survey in the service class
     */
    public deploy(): void {
        this.saveSurvey(); // Save any updated fields
        const payload = JSON.stringify(this.survey); // Generate a payload
        this.formService
            .deploySurvey(payload, this.survey.tabId.toString()) // Add the survey
            .subscribe(
                res => {
                    console.log(res);
                },
                error1 => console.log(error1), // Log errors
                () => this.openDialog()
            );
    }

    /**
     * Updates the values within survey
     * Iterates through the input tags and sets the assessments/choices description to those values
     */
    public saveSurvey(): void {
        this.survey.setDescription(
            (document.getElementById('surveyTitle') as HTMLInputElement).value
        );
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
        this.openSnackBar('Question Saved', 'Close');

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

        this.survey.tabDesc = '(' + this.excelService.getTranslationName() + ') ' + blob[0].tabViewLabel;

        let aPos = 0; // Holds the position of the assessments
        let cPos = 0; // Holds the position of the choices

        blob.forEach((item, index, array) => {
            if (index === 0) {
                this.survey.assessments[aPos].setAssessmentDescription(item.assessmentDescription.toString());
                if (item.assessmentType.toString() === '4') {
                    this.survey.assessments[aPos].setAssessmentDescription(item.assessmentDescription.toString());
                    aPos++; // Update the position of the assessment
                } else if (item.assessmentType.toString() === '5') {
                    this.survey.assessments[aPos].choices[cPos].setChoiceDescription(item.choiceLabel.toString());
                    cPos++; // Update the position of the choice
                }
            } else if (item.assessmentType.toString() === '4') {
                this.survey.assessments[aPos].setAssessmentDescription(item.assessmentDescription.toString());
                aPos++; // Update the position of the assessments
            } else if (item.assessmentType.toString() === '5' && this.survey.assessments[aPos].id === item.assessmentId) {
                this.survey.assessments[aPos].choices[cPos].setChoiceDescription(item.choiceLabel.toString());
                cPos++; // Update the position of the choice
            } else if (item.assessmentType.toString() === '5' && this.survey.assessments[aPos].id !== item.assessmentId) {
                cPos = 0; // Reset values
                aPos++; // Move onto the next assessment
                this.survey.assessments[aPos].setAssessmentDescription(item.assessmentDescription.toString());
                this.survey.assessments[aPos].choices[cPos].setChoiceDescription(item.choiceLabel.toString());
                cPos++; // Update the position of the choice
            }

        })

    }

    /**
     * Opens up a snack bar which will offer the user some feedback on an action
     * @param message
     * The message that will be displayed
     * @param action
     * An action
     */
    public openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    /**
     * Handle the dialog window
     * This dialog displays a single input which contains the URL of the deployed survey
     */
    public openDialog(): void {
        const dialogRef = this.dialog.open(DeployedLink, {
            height: '25%',
            width: '25%',
            data: {link: environment.formServerApplicationURL + this.id}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    /**
     * Sets the survey data
     * @param self
     * self view or preview view
     */
    public setSurveyData(self: boolean): void {
        this.fbService.setSurvey(this.survey);
        this.fbService.setSelf(self);
        // this.isPreview = !this.isPreview;
    }

    public setToggle() {
        this.isOpen = !this.isOpen;
    }

}

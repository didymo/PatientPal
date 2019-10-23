import {Component, OnInit, Input, Output, ViewChild, HostListener} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {SurveyService} from '../_services/survey.service';
import {TabView} from '../_classes/TabView';
import {PreviewComponent} from '../preview/preview.component';
import {ExcelService} from '../_services/excel.service';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {DeployedLink} from './deployed-link';
import {environment} from '../../environments/environment';
import {BuildFormService} from '../_services/build-form.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PayloadGenerator} from '../_payload/PayloadGenerator';
import {element} from 'protractor';
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
                animate('0.5s')
            ]),
            transition('closed => open', [
                animate('0.5s')
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
     * The id from the URL is linked to the entity ID of the tabview
     */
    private id = +this.route.snapshot.paramMap.get('id');
    /**
     * Stores an array of TabViews that have been imported from Drupal
     */
    private tabView: TabView;

    private mandatory;

    disabled = false;
    checked = false;
    isOpen = true;
    isPreview = true;
    fullPreview = false;
    previewDisabled = false;
    hideEdit = false;
    inputResult: any;
    betaClicked = false;
    /**
     * Stores an instance of the preview component
     */
    @ViewChild(PreviewComponent, {static: false}) preview;
    innerWidth: number;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }
    /**
     * Constructor for the SurveyDetailsComponent Class
     * @param fb FromBuilder
     * @param route Activated Route
     * @param formService The service class that inferfaces with Drupal
     * @param excelService
     * @param location Instance of Location
     * @param fbService
     * @param _snackBar
     * @param dialog
     * @param modalService
     */
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private formService: SurveyService,
        private excelService: ExcelService,
        private location: Location,
        private fbService: BuildFormService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private modalService: NgbModal
    ) { }
    /**
     * NgInit for the SurveyDetailComponent Class
     */
    ngOnInit() {
        this.innerWidth = window.innerWidth;
        let tmp: TabView;
        tmp = this.excelService.getExcelData();
        if(tmp === undefined) {
            tmp = this.fbService.getSurvey();
            if(tmp === undefined) {
                this.getTabView();
            } else {
                this.tabView = tmp;
                this.setSurveyData(false);
            }
        } else {
            this.tabView = tmp;
            this.updateToExcel();
        }
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
                data => this.tabView = data, // Move data into TabView
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
        this.tabView.assessments.forEach((element => {
            if(element.assessmentRequired === null) {
                element.assessmentRequired = '1';
            }
            if(element.assessmentType === '5' && element.assessmentDisplayType === null) {
                element.assessmentDisplayType = 'SelectOne'
            } else if(element.assessmentType === '4' && element.assessmentDisplayType === null) {
                element.assessmentDisplayType = 'Text'
            }
        }));
        console.log(this.tabView);
        this.setSurveyData(false);
    }

    /**
     * Saves, and submits the data to Drupal
     * Generates a JSON string
     * Calls addSurvey from the service class to interface with Drupal
     */
    public submit(): void {
        this.saveSurvey(); // Save any updated fields
        let gen = new PayloadGenerator(this.tabView);
        const payload = gen.genPayload();
        this.formService
            .addSurvey(payload) // Add the survey
            .subscribe(
                res => {
                    console.log(res);
                },
                error1 => console.log(error1), // Log errors
                () => this.openSnackBar('Survey Submitted', 'Close')
        );
    }

    /**
     * Saves, and publishes survey to drupal
     * Generates a JSON string
     * Calls publishSurvey from the service class to interface with Drupal
     */
    public publish(): void {
        this.saveSurvey(); // Save any updated fields
        let gen = new PayloadGenerator(this.tabView);
        const payload = gen.genPayload();
        // console.log(payload);
        this.formService
            .publishSurvey(payload) // Add the survey
            .subscribe(
                res => {
                    console.log(res);
                },
                error1 => console.log(error1), // Log errors
                () => this.openSnackBar('Survey Published', 'Close')
        );
    }

    /**
     * Saves, the questions, and sends a POST request to the formserver
     * Generates a JSON string
     * Calls deploy survey in the service class
     */
    public deploy(): void {
        this.saveSurvey(); // Save any updated fields
        const payload = JSON.stringify(this.tabView);
        this.formService
            .deploySurvey(payload, this.tabView.tabViewId.toString()) // Add the survey
            .subscribe(
                res => {
                    console.log(res);
                },
                error1 => this.openSnackBar('Error when deploying', 'Close'), // Log errors
                () => this.openDialog()
        );
    }

    /**
     * Updates the values within survey
     * Iterates through the input tags and sets the assessments/choices description to those values
     */
    public saveSurvey(): void {
        this.tabView.tabViewLabel = (document.getElementById('surveyTitle') as HTMLInputElement).value;
        this.tabView.assessments.forEach((item =>  {
            item.assessmentDescription =
                (document.getElementById(item.assessmentId.toString()) as HTMLInputElement).value; // Value in the input tag
            if (item.assessmentType.toString() == '5') {
                item.assessmentChoices.forEach(choice => {
                    try {
                        choice.choiceDescription =
                            (document.getElementById(choice.choiceId.toString()) as HTMLInputElement).value;
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }));
    }
    /**
     *
     * @param i Position of assessment
     * @param x Position of choice
     * @param optional Optional or not
     * @param y satisfy condition

     */
    public saveQuestion(i: number, x: number, optional: boolean, y: number): void {
        this.tabView.assessments[i].assessmentDescription =
            (document.getElementById(this.tabView.assessments[i].assessmentId.toString()) as HTMLInputElement).value;
        this.tabView.assessments[i].assessmentChoices[x].choiceDescription =
            (document.getElementById(this.tabView.assessments[i].assessmentChoices[x].choiceId.toString()) as HTMLInputElement).value;
        this.preview.updateField(i, optional, y); // Update the preview
    }

    public handleDisplayTypes(type: string, pos: number) : void {
        let required = this.tabView.assessments[pos].assessmentRequired;
        switch (type) {
            case 'Radio':
                this.preview.createRadioGroup(pos, required);
                break;
            case 'SelectMany':
                this.preview.createSelectMany(pos, required);
                break;
            case 'SelectOne':
                this.preview.createSelect(pos, required);
                break;
            case 'Text':
                this.preview.createText(pos, required);
                break;
            case 'Number':
                this.preview.createNumber(pos, required);
                break;
            default:
                console.log("Invalid Type");
        }

        this.tabView.assessments[pos].assessmentDisplayType = type;
    }

    public handleValidation(required: string, pos: number) {
        if(required === '1') {
            this.tabView.assessments[pos].assessmentRequired = '0'
        } else {
            this.tabView.assessments[pos].assessmentRequired = '1'
        }
        this.handleDisplayTypes(this.tabView.assessments[pos].assessmentDisplayType, pos);
    }

    /**
     * Exports current tabview to excel file
     */
    exportAsXLSX(): void {
        this.excelService.exportExcelFile(this.tabView, this.tabView.tabViewLabel);
    }
    /**
     * This funciton updates the tabview class based on the data from the imported XLSX files
     * A json string from the XLSX file
     */
    public updateToExcel(){
            this.tabView.tabViewLabel += ' (' +this.excelService.getTranslationName()+ ')';
            this.setSurveyData(false);
            this.openSnackBar('Import Successful', 'Close');
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
            height: '30%',
            width: '40%',
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
        this.fbService.setSurvey(this.tabView);
    }

    /**
     * Sets the state of the toggle button
     */
    public setToggle() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
            (document.getElementById('livePreview') as HTMLButtonElement).style.backgroundColor = '#016fbe';
        } else {
            (document.getElementById('livePreview') as HTMLButtonElement).style.backgroundColor = '#ffffff';
        }
        this.previewDisabled = !this.previewDisabled;
    }

    /**
     * Sets the state of the preview buttons
     */
    public setPreview() {
        this.disabled = !this.disabled;
        this.isOpen = !this.isOpen;
        this.fullPreview = !this.fullPreview;
        this.isPreview = !this.isPreview;
        this.hideEdit = !this.hideEdit;
    }

    drop(event: CdkDragDrop<string[]>) {
        // moveItemInArray(this.survey.assessments, , this.inputResult);
    }
    /**
     * Move
     * @param startPos
     */
    public moveItem(startPos: number) {
        const newPos = this.inputResult - 1;
        if (newPos > this.tabView.assessments.length) {
            this.openSnackBar('Invalid Input', 'Close');
        } else if (newPos < 0) {
            this.openSnackBar('Invalid Input', 'Close');
        } else if (newPos === startPos) {
            this.openSnackBar('Invalid Input', 'Close');
        } else if (newPos === undefined || startPos === undefined) {
            this.openSnackBar('Invalid Input', 'Close');
        } else {
            moveItemInArray(this.tabView.assessments, startPos, newPos);
            this.tabView.assessments.forEach((element, index, array) => {
               element.assessmentDelta  = index.toString();
            });
            this.preview.updateField(startPos, this.tabView.assessments[newPos].assessmentRequired, newPos);
        }
    }
    /**
     *
     * @param content content of the modal
     * @param startPos Starting position
     */
    public open(content, startPos: number) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.moveItem(startPos);
        }, (reason) => {
        });
      }
    public openBeta(content) {
        this.modalService.open(content, {ariaLabelledBy: 'open-beta-modal'}).result.then((result) => {
        }, (reason) => {
        });
    }
      public changeValue() {
        this.inputResult = (document.getElementById('orderInput') as HTMLInputElement).value;
      }
}

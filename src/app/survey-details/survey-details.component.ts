import {Component, OnInit, Input, Output, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Survey } from '../Survey';
import {SurveyService} from '../survey.service';
import {QuestionType} from '../QuestionType';
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
 * This class will handle the process of viewing a survey's questions, as well as editing them
 */
export class SurveyDetailsComponent implements OnInit {


    @ViewChild(PreviewComponent) preview;
    id = + this.route.snapshot.paramMap.get('id');
    questionType: QuestionType [];
    survey: Survey;
    payload = '';
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private formService: SurveyService,
        private location: Location
    ) { }
    /**
     * NgInit
     */
    ngOnInit() {
        this.getTabView();
    }

    /**
     * GET tab views
     * Once tab views are loaded into QuestionType, createSurvey is called
     */
    public getTabView() {

        this.formService.getTabView(this.id)
            .subscribe(
                data => this.questionType = data,
                err => console.log(err),
                () => this.sortSurvey());
    }
    /**
     * Returns a user back to the previous page
     */
    public goBack(): void {
        this.location.back();
    }
    /**
     * Sorts out assessments from the tab view into a Survey
     */
    public sortSurvey(): void {
        this.createSurvey(); // init survey
        let tempAssessment: Assessment;
        let i = 0; let j = 0;
        for (i; i < this.questionType.length; i++) {
            tempAssessment = this.createAssessment(i);
            if (this.questionType[i].assessmentType.toString() === '4') {
                tempAssessment.addChoice(this.createChoice(i, 4));
            } else if (this.questionType[i].assessmentType.toString() === '5') {
                j = i; // index of the choice
                while (this.questionType[j].assessmentId === this.questionType[i].assessmentId) {
                    tempAssessment.addChoice(this.createChoice(j, 5));
                    j++;
                }
                i = j; // Update new position of i
            }
            this.survey.addAssessment(tempAssessment);
        }
    }
    /**
     * Creates a new choice
     * @param i
     * Index of the array
     */
    public createChoice(i: number, type: number): Choice {

        const tempChoices = new Choice(
            this.questionType[i].choiceId,
            this.questionType[i].choiceLabel
        );
        if (type === 4) {
            tempChoices.setChoice(this.questionType[i].choiceDescription);
        }
        return tempChoices;
    }

    /**
     * Creates a new survey
     */
    public createSurvey(): void {
        this.survey = new Survey(
            this.questionType[0].tabViewId,
            this.questionType[0].tabViewLabel
        );
    }
    /**
     * Init temp assessment
     * @param i
     * Index of the array
     */
    public createAssessment(i: number): Assessment {
        const tempAssessment = new Assessment(
            this.questionType[i].assessmentId,
            this.questionType[i].assessmentType,
            this.questionType[i].assessmentLabel.trim()
        );
        return tempAssessment;
    }
    /**
     * Should save any of the updated fields
     */
    public submit(): void {
        this.saveSurvey();
        this.payload = JSON.stringify(this.survey);
        this.formService
            .addSurvey(this.payload)
            .subscribe(
                res => {
                    console.log(res);
                },
                error1 => console.log(error1)
            );
    }

    /**
     * Updates the values within survey
     */
    public saveSurvey(): void {
        let i = 0; // Holds the position of the assessments
        let x = 0; // Holds the position of the choices
        for (i; i < this.survey.assessments.length; i++) {
            this.survey.assessments[i].setAssessmentDescription(
                (document.getElementById(this.survey.assessments[i].id.toString()) as HTMLInputElement).value);
            for (x = 0; x < this.survey.assessments[i].choices.length; x++) {
                try {
                    this.survey.assessments[i].choices[x].setChoice(
                        (document.getElementById(this.survey.assessments[i].choices[x].id.toString()) as HTMLInputElement).value);
                } catch (e) {
                    console.log(e);
                }


            }
        }
    }
}

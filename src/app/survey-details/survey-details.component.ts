import {Component, OnInit, Input, Output} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Survey } from '../Survey';
import {SurveyService} from '../survey.service';
import {QuestionType} from '../QuestionType';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {stringify} from 'querystring';

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
    id = + this.route.snapshot.paramMap.get('id');
    questionType: QuestionType [];
    survey: Survey;
    payload = '';
    temp = '';

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
    getTabView() {

        this.formService.getTabView(this.id)
            .subscribe(
                data => this.questionType = data,
                err => console.log(err),
                () => this.sortSurvey());
    }
    /**
     * Returns a user back to the previous page
     */
    goBack(): void {
        this.location.back();
    }

    /**
     * Sorts out assessments from the tab view into a Survey
     */
    sortSurvey(): void {
        this.createSurvey(); // init survey
        let tempAssessment: Assessment; let tempChoices: Choice;
        let i = 0; let j = 0;
        for (i; i < this.questionType.length; i++) {
            tempAssessment = this.initTemp(i);
            if (this.questionType[i].assessmentType.toString() === '4') {
                tempChoices = this.createChoice(i);
                tempAssessment.addChoice(tempChoices);
            } else if (this.questionType[i].assessmentType.toString() === '5') {
                j = i;
                while (this.questionType[j].assessmentLabel === this.questionType[i].assessmentLabel) {
                    tempChoices = this.createChoice(j);
                    tempAssessment.addChoice(tempChoices);
                    j++;
                }
                i = j; // Update new position of i
            }
            console.log(tempAssessment);
            this.survey.addAssessment(tempAssessment);
        }

    }

    /**
     * Creates a new choice
     * @param i
     * Index of the array
     */
    createChoice(i: number): Choice {
        const tempChoices = new Choice(
            this.questionType[i].choiceUuid,
            this.questionType[i].choiceDescription
        );

        return tempChoices;
    }

    /**
     * Creates a new survey
     */
    createSurvey(): void {
        this.survey = new Survey(
            this.id,
            this.questionType[0].assessmentLabel
        );
    }

    /**
     * Init temp assessment
     * @param i
     * Index of the array
     */
    initTemp(i: number): Assessment {
        const tempAssessment = new Assessment(
            this.questionType[i].assessmentCode,
            this.questionType[i].assessmentType,
            this.questionType[i].assessmentDescription
        );

        return tempAssessment;
    }
    /**
     * Should save any of the updated fields
     * @todo Save added questions to the form
     */
    saveSurvey(): void {
        this.generatePayload();
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
     * Generates a payload
     */
    submit(): void {
        this.generatePayload();
        // this.temp += stringify(document.getElementById('heading').value);
    }

    generatePayload(): void {
        this.payload = '';
        this.payload += JSON.stringify(this.survey);
    }

    selectMany() {

    }
}

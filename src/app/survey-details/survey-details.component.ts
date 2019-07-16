import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Survey } from '../survey';
import {SurveyService} from '../survey.service';
import {Tabview} from '../tabview';
import {Observable} from 'rxjs';
import {QuestionType} from '../QuestionType';
import {stringify} from 'querystring';
import {SelectOne} from '../SelectOne';

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

    questionType: QuestionType [];
    survey: Survey [];
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
        this.initSurvey();
        this.getTabView();

    }

    /**
     * GET tab views
     * Once tab views are loaded into QuestionType, createSurvey is called
     */
    getTabView() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.formService.getTabView(id)
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
     * Converts questionType into a more simplified version
     * i stores the position of the questiontype
     * p stores the position of when a type 5 is created
     * y stores the position of the choices
     * x stores the positions of the survey questions
     */
    sortSurvey(): void {
        let i = 0; let p = 0;
        let y = 0; let x = 0;
        for (i; i < this.questionType.length; i++) {
            if (this.questionType[i].assessmentType.toString() === '4') { // Question is a textbox question
                    this.createSurvey(x, i);
                    x++;
            } else if (this.questionType[i].assessmentType.toString() === '5') { // Question is a select one
                this.createSelectOne(x);
                y = 0; p = i;
                while (this.questionType[i].assessmentUuid === this.questionType[p].assessmentUuid) {
                    this.addChoice(x, i, y);
                    i++;
                    y++;
                    }
                x++;
                i--;
            }
        }
    }

    /**
     * Create Survey
     * @param x
     * X
     * @param i
     * i
     */
    createSurvey(x: number, i: number) {
        this.survey[x] = new Survey(
            this.questionType[i].assessmentUuid,
            this.questionType[i].assessmentType,
            this.questionType[i].assessmentDescription
        );
    }

    /**
     * Creates a select one question
     * @param index
     * Index is used for position of surveys
     */
    createSelectOne(index: number) {
        this.survey[index] = new SelectOne(
            this.questionType[index].assessmentUuid,
            this.questionType[index].assessmentType,
            this.questionType[index].assessmentDescription
        );
    }

    addChoice(x: number, i: number, y: number) {
        this.survey[x].addChoice(
            this.questionType[i].choiceDescription,
            this.questionType[i].choiceUuid,
            y
        );
    }
    /**
     * Saves the questions/name that have been added
     * @todo Save added questions to the form
     */
    saveSurvey(): void {
        console.log(this.questionType.length + ' ' + this.survey.length);
    }
    /**
     * @todo Figure out how to pass a XSL to enketo
     */
    initSurvey(): void {
        this.survey = [
            new Survey(
                't',
                1,
                ''
            )
        ];
    }

    submit(): void {
        let i = 0;
        for (i; i < this.survey.length; i++) {
            // console.log(this.survey[i].assessmentDesc);
            this.payload += JSON.stringify(this.survey[i]);
        }
    }
}

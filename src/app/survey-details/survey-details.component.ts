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

    // surveyForm = this.fb.group({
    //     assessmentCode: this.fb.control(''),
    //     assessmentDescription: this.fb.control(''),
    //     assessmentType: this.fb.control(''),
    //     assessmentLabel: this.fb.control(''),
    //     assessmentUuid: this.fb.control(''),
    //     choiceCode: this.fb.control(''),
    //     choiceDescription: this.fb.control(''),
    //     choiceLabel: this.fb.control(''),
    //     choiceUuid: this.fb.control(''),
    // });

    surveyForm: FormGroup;
    items: FormArray;

    name = new FormControl(''); // Name of the survey

    @Input() survey: QuestionType;

    questionType: QuestionType [];

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

        this.surveyForm = this.fb.group({
            assessmentCode: this.fb.control(''),
            assessmentDescription: this.fb.control(''),
            items: this.fb.array([this.createItem()])
        });

    }

    /**
     * Gets tab views
     */
    getTabView() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.formService.getTabView(id)
            .subscribe(data => this.questionType = data);
    }
    /**
     * Returns a user back to the previous page
     */
    goBack(): void {
        this.location.back();
    }

    createItem(): FormGroup {
        return this.fb.group({
            assessmentCode: '',
            assessmentDescription: ''
        });
    }

    addItem(): void {
        this.items = this.surveyForm.get('items') as FormArray;
        this.items.push(this.createItem());
    }

    /**
     * Saves the questions/name that have been added
     * @todo Save added questions to the form
     */
    saveSurvey(): void {
    }

    /**
     * This function deletes an option
     */
    deleteOption(id: string): void {
        document.getElementById(id).remove();
    }
    /**
     * @todo Figure out how to pass a XSL to enketo
     */
    previewForm(): void {

    }

    submit(): void {

    }
}

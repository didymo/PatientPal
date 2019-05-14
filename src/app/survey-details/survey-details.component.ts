import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Survey } from '../survey';
import {SurveyService} from '../survey.service';

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

  surveyForm = this.fb.group({
    questions: this.fb.array([
      this.fb.control('')
    ])
  });
  name = new FormControl(''); // Name of the survey

  @Input() survey: Survey;
  private optionElement: string;

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
    this.getSurvey();
  }
  /**
   * Gets the survey based on ID.
   */
  getSurvey(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.formService.getSurvey(id)
      .subscribe(survey => this.survey = survey);
  }
  /**
   * Returns a user back to the previous page
   */
  goBack(): void {
    this.location.back();
  }
  /**
   *
   */
  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }
  /**
   * Adds a question onto the survey
   */
  addQuestion() {
    this.questions.push(this.fb.control(''));
  }
  /**
   * @param i takes and removes that value from the form array
   */
  removeQuestion(i: number): void  {
    this.questions.removeAt(i);
  }
  /**
   * Saves the questions/name that have been added
   * @todo Save added questions to the form
   */
  saveSurvey(): void {
    this.formService.updateSurvey(this.survey)
      .subscribe(() => this.goBack());
  }

  /**
   * This function adds an extra option
   */
  createOption(): void {

    this.optionElement = '<span><input type=\"radio\" name=\"gender\" value=\"newOption\"> new</span>';

    document.getElementById('content').innerHTML += this.optionElement;

  }

}

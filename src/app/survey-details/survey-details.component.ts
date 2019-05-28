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
    ]),
  });
  name = new FormControl(''); // Name of the survey

  @Input() survey: Survey;
  private optionElement: string;
  private optionCnt: number;

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

    // this.optionElement = '<span><input type=\"radio\" name=\"gender\" value=\"newOption\"> new<br></span>';
    this.optionElement = '<div class="input-group" id="optionGroup">\n' +
        '            <div class="input-group-prepend">\n' +
        '              <div class="input-group-text">\n' +
        '                <input type="radio" aria-label="Radio button for following text input">\n' +
        '              </div>\n' +
        '            </div>\n' +
        '            <input type="text" class="form-control" aria-label="Text input with radio button" >\n' +
        '            <div class="input-group-append">\n' +
        '              <button class="btn btn-outline-danger" type="button" (click)="deleteOption(\'optionGroup\')">Delete</button>\n' +
        '            </div>\n' +
        '          </div>';
    document.getElementById('content').innerHTML += this.optionElement;

  }

  /**
   * This function deletes an option
   */
  deleteOption(id: string): void {
    document.getElementById(id).remove();
  }

  optionText(): void {
    this.deleteOption('optionGroup');
    this.optionElement = '<div class="form-group">\n' +
        '    <label for="exampleFormControlTextarea1">Text Box Question</label>\n' +
        '    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>\n' +
        '    <button class="btn btn-outline-danger" type="button" (click)="deleteOption(\'optionGroup\')">Delete</button>\n' +
        '  </div>';
    document.getElementById('content').innerHTML += this.optionElement;
  }

  optionNumber(): void {
    this.deleteOption('optionGroup');
    this.optionElement = '<div class="form-group">\n' +
        '    <label for="exampleFormControlTextarea1">Number Question</label>\n' +
        '    <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>\n' +
        '  </div>';
    document.getElementById('content').innerHTML += this.optionElement;
  }

  showOptions(): void {
    document.getElementById('optionDropdown').classList.toggle('show');
  }

  /**
   * @todo Figure out how to pass a XSL to enketo
   */
  previewForm(): void {

  }

}

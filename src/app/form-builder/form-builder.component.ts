import {Component, Input, OnInit} from '@angular/core';
import {Survey} from '../_classes/Survey';
import {QuestionControlService} from '../_services/question-control.service';
import {QuestionBase} from '../_questions/question-base';
import {FormGroup} from '@angular/forms';
import {DropdownQuestion} from '../_questions/question-dropdown';
import {TextboxQuestion} from '../_questions/question-textbox';
import {NumberField, RadioGroupField, SelectField, TextField} from '@esss/ng-xform';
import {RadioQuestion} from '../_questions/question-radio';
import {NumberQuestion} from '../_questions/question-number';


@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.css'],
    providers: [QuestionControlService]
})
export class FormBuilderComponent implements OnInit {

    @Input() survey: Survey;
    @Input() fields: QuestionBase<any>[] = [];

    form: FormGroup;
    payLoad = '';

    constructor(private qcs: QuestionControlService) {
    }

    ngOnInit() {
        this.getQuestions();
        this.form = this.qcs.toFormGroup(this.fields);
    }

    onSubmit() {
        this.payLoad = JSON.stringify(this.form.value);
    }

    getQuestions() {

        for (let i = 0; i < this.survey.assessments.length; i++) {
            if (this.survey.assessments[i].asessmentType.toString() === '5') {
                this.createSelect(i, false);
                // this.createRadioGroup(i, false)
            } else {
                this.createText(i, false);
            }
        }

    }


    /**
     * This funtion is used to create a SelectField
     * @param i Is used to determine which assessment has been inputted
     * @param optional
     * Whether or not a question is optional or not
     */
    public createSelect(i: number, optional: boolean) {

        let tempField: SelectField;

        // Check if field already exists
        if (this.fieldCheck(i, 'dropdown')) {
            return;
        }

        // Push new select into the fields array
        tempField = new DropdownQuestion({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                options: this.survey.assessments[i].choices,
                order: i,
                required: false
            },
            this.survey.assessments[i].choices);
        console.log(tempField.controlType);

        // Reposition
        this.orderField(i, tempField);
    }

    /**
     * Used to create a TextField
     * @param i Is used to determine which assessment has been inputed
     * @param optional
     * Whether or not a question is optional or not
     */
    public createText(i: number, optional: boolean) {
        let tempField: TextField;

        // Check if field already exists
        if (this.fieldCheck(i, 'TEXT')) {
            return;
        }
        // Push new text field into the fields array
        tempField = new TextboxQuestion({
            key: this.survey.assessments[i].id,
            label: this.survey.assessments[i].assessmentDesc,
            order: i,
            required: false
        });

        // Reposition
        this.orderField(i, tempField);
    }

    /**
     * This funtion is used to create a RadioGroup
     * @param i Is used to determine which assessment has been inputed
     * @param optional
     * Whether or not a question is optional or not
     */
    public createRadioGroup(i: number, optional: boolean) {

        let tempField: RadioGroupField;

        // Check if field already exists
        if (this.fieldCheck(i, 'RADIOGROUP')) {
            return;
        }
        // Push new radio group into the fields array
        tempField = new RadioQuestion({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                options: this.survey.assessments[i].choices,
                order: i,
                required: false
            },
            this.survey.assessments[i].choices);

        // Reposition
        this.orderField(i, tempField);
    }

    /**
     * Used to create a NumberField
     * @param i Is used to determine which assessment has been inputed
     * @param optional
     * Whether or not a question is optional or not
     */
    public createNumber(i: number, optional: boolean): void {

        let tempField: NumberField;

        // Check if field already exists
        if (this.fieldCheck(i, 'NUMBER')) {
            return;
        }
        // Push new number field into the fields array
        tempField = new NumberQuestion({
            key: this.survey.assessments[i].id,
            label: this.survey.assessments[i].assessmentDesc + ' (Number)',
            order: i,
            type: 'number',
            required: true
        });

        // Reposition
        this.orderField(i, tempField);
    }

    /**
     * This function will return a boolean whether or not an element already exists in the array
     * @param i
     * i is the index of the array which will be checked
     */
    public fieldCheck(i: number, fieldType: string): boolean {
        let j = 0;
        for (j; j < this.fields.length; j++) {
            if (this.fields[j].key === this.survey.assessments[i].id.toString() && fieldType === this.fields[j].controlType) {
                return true;
            } else if (this.fields[j].key === this.survey.assessments[i].id.toString()) {
                this.removeField(j);
                return false;
            }
        }
        return false;
    }

    /**
     * This function will remove a specified element in the fields array
     * @param i
     * i is the index of the array which will be removed
     */
    public removeField(i: number) {
        this.fields.splice(i, 1);
    }

    /**
     * This function is used to order the position of a newly added field
     * @param i
     * i is the index of the array which will be added
     */
    public orderField(i: number, field: any) {
        this.fields.splice(i, 0, field);
    }

    /**
     * This function removes and inserts the new data
     * @param i
     * Index of the array which will be added
     * @param optional
     * Whether or not a question is optional or not
     */
    public updateField(i: number, optional: boolean): void {

        switch (this.fields[i].controlType) {
            case 'SELECT':
                this.removeField(i);
                this.createSelect(i, optional);
                break;
            case 'RADIOGROUP':
                this.removeField(i);
                this.createRadioGroup(i, optional);
                break;
            case 'TEXT':
                this.removeField(i);
                this.createText(i, optional);
                break;
            case 'NUMBER':
                this.removeField(i);
                this.createNumber(i, optional);
                break;
            // case 'CHECK':
            //     this.removeField(i);
            //     this.createCheckBox(i, optional);
            //     break;
        }
    }

}

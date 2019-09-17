import {Component, ElementRef, Input, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    CheckboxField,
    DynamicField,
    NgXformEditSaveComponent,
    NgXformModule, NumberField,
    RadioGroupField,
    SelectField, TextField
} from '@esss/ng-xform';
import {AppComponent} from '../app.component';
import {Title} from '@angular/platform-browser';
import {of, Subject, Subscription} from 'rxjs';
import {Validators} from '@angular/forms';
import {Survey} from '../_classes/Survey';
import {delay} from 'rxjs/operators';
import {BuildFormService} from '../_services/build-form.service';


@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})

@NgModule({
    declarations: [AppComponent] ,
    imports: [NgXformModule],
    bootstrap: [AppComponent]
})
/**
 * Handles the previewing of Surveys
 * When a user is editing a survey this component will display what the actual question will look like
 */
export class PreviewComponent implements OnInit {

    @ViewChild(NgXformEditSaveComponent, {static: true}) xformComponent: NgXformEditSaveComponent;
    @ViewChild('customField', {static: true}) customFieldTmpl: TemplateRef<any>;

    // @Input() survey: Survey;

    survey: Survey;
    private self: boolean;

    public onchangefn = new Subject<string>();
    /**
     * Stores the fields
     */
    public fields: DynamicField[];
    /**
     * Determine if a form is horizontal viewing or not
     */
    public horizontal = false;
    /**
     * Defines the width of a label
     */
    public labelWidth = 0;
    public model: any;
    public outputhelper = {A: 1, B: 2, C: 3};
    public subscriptions: Subscription[] = [];

    docHTML = '';

    /**
     * Constructor for PreviewComponent
     * @param titleService
     * Used to set the title of the window
     * @param fbService
     * Retrieve surveys from component
     */
    constructor(
        private titleService: Title,
        private fbService: BuildFormService
    ) { }

    /**
     * ngOnInit for PreviewComponent
     */
    ngOnInit() {

        this.survey = this.fbService.getSurvey();
        this.self = this.fbService.getSelf();

        this.subscriptions.push(this.onchangefn.asObservable().subscribe(
            (value: any) =>  this.xformComponent.setValue({outputopt: this.outputhelper[value]})
        ));
        this.titleService.setTitle('TabviewList | ' + this.survey.tabDesc); // Sets the title
        this.initWidgets(); // Initiates the widgets

    }
    /**
     * This function is used to init the fields array.
     * The fields will be used to display the different type of questions
     */
    public initWidgets() {

        this.fields = [
            new TextField({
                key: this.survey.assessments[0].id,
                label: this.survey.assessments[0].assessmentDesc,
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            }),
        ];

        let i = 0;
        for (i; i < this.survey.assessments.length; i++) {
            this.removeField(i);
            if (this.survey.assessments[i].asessmentType.toString() === '5') {
                this.createRadioGroup(i, false);
                this.createSelect(i, false);
            } else {
                this.createText(i, false);
            }
        }
    }

    /**
     * This funtion is used to create a selectOne
     * @param i Is used to determine which assessment has been inputed
     * @param optional
     * Determine if a question is optional or not
     */
    public createSelect(i: number, optional: boolean) {

        let tempField: SelectField;

        // Check if field already exists
        if (this.fieldCheck(i, 'SELECT')) {
            this.removeField(i);
        }
        // Condition depending on a question is optional or not
        if (optional) {
            // Push new select into the fields array
            tempField = new SelectField({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                searchable: true,
                options: this.survey.assessments[i].choices,
                addNewOption: true,
                addNewOptionText: 'id',
                optionLabelKey: 'choiceDesc',
            });
        } else {
            // Push new select into the fields array
            tempField = new SelectField({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                searchable: false,
                options: this.survey.assessments[i].choices,
                addNewOption: true,
                addNewOptionText: 'id',
                optionLabelKey: 'choiceDesc',
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ],

            });
        }
        // Reposition
        this.orderField(i, tempField);

    }

    /**
     * This funtion is used to create a SelectField
     * @param i Is used to determine which assessment has been inputted
     * @param optional
     * Whether or not a question is optional or not
     */
    public createSelectMany(i: number, optional: boolean) {

        let tempField: SelectField;

        // Check if field already exists
        if (this.fieldCheck(i, 'SELECT')) {
            this.removeField(i);
        }
        // Condition depending on a question is optional or not
        if (optional) {
            // Push new select into the fields array
            tempField = new SelectField({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                searchable: true,
                options: this.survey.assessments[i].choices,
                addNewOption: true,
                addNewOptionText: 'id',
                optionLabelKey: 'choiceDesc',
                multiple: true,
            });
        } else {
            // Push new select into the fields array
            tempField = new SelectField({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                searchable: true,
                options: this.survey.assessments[i].choices,
                addNewOption: true,
                addNewOptionText: 'id',
                optionLabelKey: 'choiceDesc',
                multiple: true,
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            });
        }

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
        // Condition depending on a question is optional or not
        if (optional) {
            // Push new radio group into the fields array
            tempField = new RadioGroupField({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                options: of(this.survey.assessments[i].choices).pipe(delay(10)),
                optionValueKey: 'id',
                optionLabelKey: 'choiceDesc',
            });
        } else {
            // Push new radio group into the fields array
            tempField = new RadioGroupField({
                key: this.survey.assessments[i].id.toString(),
                label: this.survey.assessments[i].assessmentDesc,
                options: of(this.survey.assessments[i].choices).pipe(delay(10)),
                optionValueKey: 'id',
                optionLabelKey: 'choiceDesc',
                validators: [
                    Validators.required
                ]
            });
        }

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
        // Condition depending on a question is optional or not
        if (optional) {
            // Push new text field into the fields array
            tempField = new TextField({
                key: this.survey.assessments[i].id,
                label: this.survey.assessments[i].assessmentDesc,
            });
        } else {
            // Push new text field into the fields array
            tempField = new TextField({
                key: this.survey.assessments[i].id,
                label: this.survey.assessments[i].assessmentDesc,
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            });
        }


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
        // Condition depending on a question is optional or not
        if (optional) {
            // Push new number field into the fields array
            tempField = new NumberField({
                key: this.survey.assessments[i].id,
                label: this.survey.assessments[i].assessmentDesc + ' (Number)',
            });
        } else {
            // Push new number field into the fields array
            tempField = new NumberField({
                key: this.survey.assessments[i].id,
                label: this.survey.assessments[i].assessmentDesc + ' (Number)',
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            });
        }

        // Reposition
        this.orderField(i, tempField);
    }

    /**
     * Used to create a TextField
     * @param i Is used to determine which assessment has been inputed
     */
    public createCheckBox(i: number, optional: boolean) {

        // Check if field already exists
        if (this.fieldCheck(i, 'CHECK')) {
            return;
        }
        // Push new text field into the fields array
        const tempField = new CheckboxField({
            key: this.survey.assessments[i].id,
            label: this.survey.assessments[i].assessmentDesc,
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
            if (this.fields[j].key === this.survey.assessments[i].id && fieldType === this.fields[j].controlType) {
                return true;
            } else if (this.fields[j].key === this.survey.assessments[i].id) {
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
            case 'CHECK':
                this.removeField(i);
                this.createCheckBox(i, optional);
                break;
        }
    }

}

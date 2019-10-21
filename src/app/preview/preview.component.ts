import {Component, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
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
import {delay} from 'rxjs/operators';
import {BuildFormService} from '../_services/build-form.service';
import {TabView} from '../_classes/TabView';



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

    tabView: TabView;
    private self: boolean;

    public onchangefn = new Subject<string>();
    /**
     * Stores the fields
     */
    public fields: DynamicField[];
    /**
     * Determine if a form is horizontal viewing or not
     */
    public horizontal = true;
    /**
     * Defines the width of a label
     */
    public labelWidth = 0
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

        this.tabView = this.fbService.getSurvey();

        this.subscriptions.push(this.onchangefn.asObservable().subscribe(
            (value: any) =>  this.xformComponent.setValue({outputopt: this.outputhelper[value]})
        ));
        this.titleService.setTitle('TabviewList | ' + this.tabView.tabViewLabel); // Sets the title
        this.initWidgets(); // Initiates the widgets

    }

    changeTitle(i: number, title: string) {
        this.fields[i].label = title;
    }

    changeChoice(i: number, x: number, title: string) {
        this.tabView.assessments[i].assessmentChoices[x].choiceDescription = title;
    }
    /**
     * This function is used to init the fields array.
     * The fields will be used to display the different type of questions
     */
    public initWidgets() {

        this.fields = [
            new TextField({
                key: this.tabView.assessments[0].assessmentId,
                label: this.tabView.assessments[0].assessmentDescription,
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            }),
        ];

        for (let i = 0; i < this.tabView.assessments.length; i++) {
            this.removeField(i);
            if (this.tabView.assessments[i].assessmentType === '5') {
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

        let options = [];
        this.tabView.assessments[i].assessmentChoices.forEach(element => {
            options.push((element.choiceId, element.choiceDescription));
        });

        let tempField: SelectField;

        // Check if field already exists
        if (this.fieldCheck(i, 'SELECT')) {
            this.removeField(i);
        }
        // Push new select into the fields array
        tempField = new SelectField({
            key: this.tabView.assessments[i].assessmentId.toString(),
            label: this.tabView.assessments[i].assessmentDescription,
            searchable: false,
            options: options,
            addNewOption: true,
            addNewOptionText: 'id',
            optionLabelKey: 'choiceDesc',
            validators: [
                Validators.required,
                Validators.minLength(1)
            ],
        });
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
        // Push new select into the fields array
        tempField = new SelectField({
            key: this.tabView.assessments[i].assessmentId.toString(),
            label: this.tabView.assessments[i].assessmentDescription,
            searchable: true,
            options: this.tabView.assessments[i].assessmentChoices,
            addNewOption: true,
            addNewOptionText: 'id',
            optionLabelKey: 'choiceDesc',
            multiple: true,
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
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
        tempField = new RadioGroupField({
            key: this.tabView.assessments[i].assessmentId.toString(),
            label: this.tabView.assessments[i].assessmentDescription,
            options: of(this.tabView.assessments[i].assessmentChoices).pipe(delay(10)),
            optionValueKey: 'id',
            optionLabelKey: 'choiceDesc',
            validators: [
                Validators.required
            ]
        });
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
        tempField = new TextField({
            key: this.tabView.assessments[i].assessmentId,
            label: this.tabView.assessments[i].assessmentDescription,
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
        });
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
        tempField = new NumberField({
            key: this.tabView.assessments[i].assessmentId,
            label: this.tabView.assessments[i].assessmentDescription,
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
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
            if (this.fields[j].key === this.tabView.assessments[i].assessmentId && fieldType === this.fields[j].controlType) {
                return true;
            } else if (this.fields[j].key === this.tabView.assessments[i].assessmentId) {
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
    public updateField(i: number, optional: boolean, endPos: number): void {
        let x = this.checkPos(i, endPos);
        switch (this.fields[i].controlType) {
            case 'SELECT':
                this.removeField(i);
                this.createSelect(x, optional);
                break;
            case 'RADIOGROUP':
                this.removeField(i);
                this.createRadioGroup(x, optional);
                break;
            case 'TEXT':
                this.removeField(i);
                this.createText(x, optional);
                break;
            case 'NUMBER':
                this.removeField(i);
                this.createNumber(x, optional);
                break;
        }
    }

    /**
     * Determines if positions are equal to each other
     * @param x start position
     * @param y new position
     */
    public checkPos(x: number, y: number) : number {
        if(x === y) {
            return x;
        } else {
            return y;
        }
    }

}

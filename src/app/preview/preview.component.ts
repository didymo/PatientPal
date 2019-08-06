import {Component, Input, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    CheckboxField,
    CustomField, DateField,
    DateRangeField,
    DynamicField,
    MeasureField, MultilineField, NestedFormGroup,
    NgXformEditSaveComponent,
    NgXformModule,
    RadioGroupField,
    SelectField, TextField
} from '@esss/ng-xform';
import {AppComponent} from '../app.component';
import {Title} from '@angular/platform-browser';
import {Observable, Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs/internal/observable/of';
import {Validators} from '@angular/forms';
import {delay, map} from 'rxjs/operators';
import {Survey} from '../Survey';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})

@NgModule({
    declarations: [AppComponent] ,
    imports: [NgXformModule] ,
    bootstrap: [AppComponent]
})
export class PreviewComponent implements OnInit {

    @ViewChild(NgXformEditSaveComponent) xformComponent: NgXformEditSaveComponent;
    @ViewChild('customField') customFieldTmpl: TemplateRef<any>;

    @Input() survey: Survey;
    private setting = {
        element: {
            dynamicDownload: null as HTMLElement
        }
    };
    private colors: any[] = [
        { id: 0, name: 'other' },
        { id: 1, name: 'blue' },
        { id: 2, name: 'yellow' },
        { id: 3, name: 'white' },
        { id: 4, name: 'black' },
        { id: 5, name: 'orange' },
        { id: 6, name: 'purple' }
    ];

    public onchangefn = new Subject<string>();

    public fields: DynamicField[];
    public horizontal = false;
    public labelWidth = 2;
    public model: any;
    public outputhelper = {A: 1, B: 2, C: 3};
    public subscriptions: Subscription[] = [];

    docHTML = '';

    constructor(
        private titleService: Title,
        private http: HttpClient
    ) { }

    ngOnInit() {

        const minDate = new Date();
        const maxDate = new Date();

        this.subscriptions.push(this.onchangefn.asObservable().subscribe(
            (value: any) =>  this.xformComponent.setValue({outputopt: this.outputhelper[value]})
        ));

        minDate.setDate(minDate.getDate() - 3);
        maxDate.setDate(maxDate.getDate() + 3);
        this.titleService.setTitle('Home | @esss/ng-xform');

        this.initWidgets();
    }

    public initWidgets() {
        let i = 0;
        this.fields = [
            new TextField({
                key: 'name',
                label: 'Name',
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            })
        ];

        for (i = 0; i < this.survey.assessments.length; i++) {
            if (this.survey.assessments[i].assessmentType.toString() === '4') {

            }
        }
    }

    public createSelect(i: number) {
        this.fields.push(
            new SelectField({
                key: this.survey.assessments[i].id,
                label: this.survey.assessments[i].assessmentDesc,
                searchable: true,
                options: this.survey.assessments[i].choices,
                addNewOption: true,
                addNewOptionText: 'Add Color',
                optionLabelKey: 'name',
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            })
        );
    }

    public createText(i: number) {
        this.fields.push(
            new TextField({
                key: this.survey.assessments[i].id,
                label: this.survey.assessments[i].assessmentDesc,
                validators: [
                    Validators.required,
                    Validators.minLength(1)
                ]
            })
        );
    }
    public export() {
        const doc = document.getElementById('xform');
        this.docHTML = doc.outerHTML;

        this.createFile();
    }

    public createFile() {
        let textFile = null;

        const makeTextFile = text => {
            const data = new Blob([text], {type: 'text/plain'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };
        const create = document.getElementById('create');
        const textbox = document.getElementById('textbox');

        create.addEventListener('click', () => {
            const link = document.getElementById('downloadlink');
            // @ts-ignore
            link.href = makeTextFile(this.docHTML);
            link.style.display = 'block';
        }, false);
    }

    public onSubmit(values: object) {
        this.model = values;
    }
}

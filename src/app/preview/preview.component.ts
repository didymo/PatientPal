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
                this.fields.push(
                    new TextField({
                        key: this.survey.assessments[i].id,
                        label: this.survey.assessments[i].assessmentDesc,
                        validators: [
                            Validators.minLength(1)
                        ]
                    })
                );
            } else if (this.survey.assessments[i].assessmentType.toString() === '5') {
                this.fields.push(
                    new SelectField({
                        key: this.survey.assessments[i].id,
                        label: this.survey.assessments[i].assessmentDesc,
                        searchable: true,
                        options: this.survey.assessments[i].choices,
                        addNewOption: true,
                        addNewOptionText: 'Add Color',
                        optionLabelKey: 'name',
                    })
                );
            }

        }
    }

    public onSubmit(values: object) {
        this.model = values;
    }

    populate() {
        this.xformComponent.setValue({
            name: 'Customer',
            email: 'customer@mail.com',
            type_tags: [2],
            type: 'b',
            color: { id: 3, name: 'white' },
            color_ro: { id: 3, name: 'white' },
            address: {
                street: 'ChIJn7h-4b9JJ5URGCq6n0zj1tM'
            },
            gender: 1,
            length: { value: 2, unit: 'm'},
            width: { value: 3, unit: 'ft'},
            opt: 'A',
            news: true,
            comment: 'Mussum Ipsum, caci.',
            birth: new Date(),
            range: [
                '2018-09-06T03:00:00.000Z',
                '2018-10-08T03:00:00.000Z'
            ],
            custom_amount: 456
        });
    }

    public observableSource(keyword: any): Observable<any[]> {
        const url = `https://restcountries.eu/rest/v2/name/${keyword}`;
        if (keyword) {
            return this.http.get(url)
                .pipe(
                    map((res) => res as any[])
                );
        } else {
            return of([]);
        }
    }

    // public observableSourceByPlaceId(keyword: any): Observable<any> {
    //   return of({
    //     'alpha3Code': 'BRA',
    //     'name': 'Brazil'
    //   }).pipe(delay(300));
    // }
}

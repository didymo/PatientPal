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

        this.fields = [
        new TextField({
          key: 'name',
          label: 'Name',
          validators: [
            Validators.minLength(3)
          ]
        }),
        new TextField({
          key: 'email',
          label: 'E-mail',
          validators: [
            Validators.required,
            Validators.email
          ]
        }),
        new SelectField({
          key: 'color_ro',
          label: 'Color read-only',
          readOnly: true,
          searchable: true,
          options: this.colors,
          optionLabelKey: 'name',
        }),
        new SelectField({
          key: 'color',
          label: 'Color',
          searchable: true,
          options: this.colors,
          addNewOption: true,
          addNewOptionText: 'Add Color',
          optionLabelKey: 'name',
        }),
        new TextField({
          key: 'other',
          label: 'Other color',
          visibilityFn: (value: any) => value.color && value.color.id === 0
        }),

        new SelectField({
          key: 'type',
          label: 'Type',
          options: ['a', 'b'],
          validators: [
            Validators.required
          ]
        }),
        new SelectField({
          key: 'type_tags',
          label: 'Type tags',
          options: [{id: 1, description: 'A'}, {id: 2, description: 'B'}, {id: 3, description: 'C'}],
          optionLabelKey: 'description',
          optionValueKey: 'id',
          multiple: true
        }),
        new SelectField({
          key: 'opt',
          label: 'Select an option',
          options: [{id: 'A', description: 'Option A'}, {id: 'B', description: 'Option B'}, {id: 'C', description: 'Option C'}],
          optionLabelKey: 'description',
          optionValueKey: 'id',
          onChangeFn: (value: string) => {
            this.onchangefn.next(value);
          }
        }),
        new TextField({
          key: 'outputopt',
          label: 'Output of option',
          readOnly: true,
        }),
        new CheckboxField({
          key: 'news',
          label: 'News'
        }),
        new MultilineField({
          key: 'comment',
          label: 'Comment',
          rows: 4
        }),
        new DateRangeField({
          key: 'range',
          label: 'Date range',
          theme: 'blue'
        }),
        new CustomField({
          key: 'custom_amount',
          label: 'Custom Field Amount',
          tmpl: this.customFieldTmpl
        }),
      ];
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

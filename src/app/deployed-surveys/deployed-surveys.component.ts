import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {SurveyService} from '../_services/survey.service';
import {DeployedForms} from '../_classes/DeployedForms';
import {TabView} from '../_classes/TabView';
import {BuildFormService} from '../_services/build-form.service';
import {Router} from '@angular/router';

@Pipe({
    name: 'deployedSurveySearch'
})
/**
 * Used to handle the search functionality of the application
 * Searches for specific TabViews
 * Displays a search bar on the application
 * A user can enter search terms and then see any TabView with similar characters
 * @author Peter Charles Sims
 */
export class DeployedSurveySearch implements PipeTransform {

    transform(value: DeployedForms[], term: string): DeployedForms[] {
        if (term == null) {
            return value;
        } else {
            return value.filter(item => item.name.toLowerCase().match(term.toLowerCase()));
        }
        return
    }

}

@Component({
    selector: 'app-deployed-surveys',
    templateUrl: './deployed-surveys.component.html',
    styleUrls: ['./deployed-surveys.component.css'],
    providers: [DeployedSurveySearch]
})
/**
 * File that handles the displaying of Deployed Surveys
 * @author Peter Charles Sims
 */
export class DeployedSurveysComponent implements OnInit {

    constructor(private surveyService: SurveyService, private fbService: BuildFormService, private router: Router) { }

    str: any;
    strString: string;
    tabview: TabView;
    deployedForms: DeployedForms[];
    queryString: string;

    ngOnInit() {
        this.getSurveys();
    }

    /**
     * Requests for the surveys
     */
    public getSurveys() {
        this.surveyService.getDeployedForms()
            .subscribe(
                data => this.str = data,
                error1 => console.log(error1),
                () => this.sortString()
            )
    }

    /**
     * Converts json string into deployedForm object
     */
    public sortString(): void {
        let json = JSON.parse(this.str);
        eval(json);
        this.deployedForms = json['Deployed_Forms'].map(element => {
            return element
        });

        console.log(this.deployedForms);
    }

    /**
     * Requests for the relevant data for the tab view
     * @param i
     */
    public getTabView(i: number): void {
        const id = this.deployedForms[i].id;
        this.surveyService.getDeployedSurvey(id)
            .subscribe(
                data => this.strString = data,
                error => console.log(error),
                () =>  {
                    this.sortTabView();
                    this.fbService.setSurvey(this.tabview);
                    this.router.navigate(['/detail/' + id]);
                }
            )
    }

    /**
     * Sorts the tab view
     */
    public sortTabView()  {
        let json = JSON.parse(this.strString);
        eval(json);
        this.tabview = json;
    }

}

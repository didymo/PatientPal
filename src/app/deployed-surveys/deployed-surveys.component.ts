import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {SurveyService} from '../_services/survey.service';
import {DeployedSurvey} from '../_classes/DeployedSurvey';


@Pipe({
    name: 'deployedSurveySearch'
})
/**
 * Used to handle the search functionality of the application
 * Searches for specific TabViews
 * Displays a search bar on the application
 * A user can enter search terms and then see any TabView with similar characters
 */
export class DeployedSurveySearch implements PipeTransform {


    transform(value: DeployedSurvey[], term: string): DeployedSurvey[] {
        if (term == null) {
            return value;
        } else {
            return value.filter(item => item.name.toLowerCase().match(term.toLowerCase()));
        }
    }

}

@Component({
    selector: 'app-deployed-surveys',
    templateUrl: './deployed-surveys.component.html',
    styleUrls: ['./deployed-surveys.component.css'],
    providers: [DeployedSurveySearch]
})
export class DeployedSurveysComponent implements OnInit {

    constructor(private surveyService: SurveyService) { }

    surveyString: string[];
    surveys: DeployedSurvey[];
    queryString: string;

    ngOnInit() {
        this.getSurveys();

    }

    public getSurveys() {
        this.surveyService.getDeployedSurveys()
            .subscribe(
                data => this.surveys = data,
                error1 => console.log(error1),
                () => this.sortString()
            )
    }

    public sortString(): void {
        // let tmp;
        // let obj;
        // let x = 0;
        // let count = 0;
        // let text = '{ "DeployedSurvey" : []}';
        //     obj = JSON.parse(text);
        // this.surveyString.forEach((item, index, array) => {
        //     if (count === 0) {
        //         obj.DeployedSurvey.name = item
        //         count = 1;
        //     } else {
        //         obj.DeployedSurvey.id = item;
        //         count = 0;
        //     }
        // });
        //
        // this.surveys[0] = new DeployedSurvey(obj.DeployedSurvey.name, obj.DeployedSurvey.id);
    }

}

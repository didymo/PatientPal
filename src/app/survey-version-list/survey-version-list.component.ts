import { Component, OnInit } from '@angular/core';
import {SurveyService} from '../_services/survey.service';
import {TabViewVersion} from '../_classes/TabViewVersion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-version-list',
  templateUrl: './survey-version-list.component.html',
  styleUrls: ['./survey-version-list.component.css']
})
export class SurveyVersionListComponent implements OnInit {

    //this holds the list of versions
    versions: TabViewVersion[];
    
    //The id from the URL is linked to the entity ID of the tabview
    private id = +this.route.snapshot.paramMap.get('id');

    constructor(private surveyService: SurveyService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getTabViewVersions();
    }
  
    getTabViewVersions() {
        this.surveyService.getTabViewVersions(this.id)
            .subscribe(
                data => this.versions = data,
                err => console.log(err),
            );
    }
}

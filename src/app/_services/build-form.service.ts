import {Injectable} from '@angular/core';
import {TabView} from '../_classes/TabView';

@Injectable({
    providedIn: 'root'
})

/**
 * This service will be used to transfer Surveys between the survey editor and the standalone preview
 * @author Peter Charles Sims
 */
export class BuildFormService {

    private survey: TabView;
    private surveyStatus: boolean;

    constructor() {
    }

    /**
     * Returns a survey and then removes the data
     */
    public getSurvey(): TabView {
        let survey = this.survey;
        this.removeSurvey();
        return survey;
    }

    /**
     * The survey is now undefined
     */
    public removeSurvey(): void {
        this.survey = undefined;
    }

    /**
     * Sets the survey
     * @param survey
     * An instance of a survey object
     */
    public setSurvey(survey: TabView): void {
        this.survey = survey;
    }

}

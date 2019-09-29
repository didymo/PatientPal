import {Injectable} from '@angular/core';
import {Survey} from '../_classes/Survey';

@Injectable({
    providedIn: 'root'
})

/**
 * This service will be used to transfer Surveys between the survey editor and the standalone preview
 */
export class BuildFormService {

    private survey: Survey;
    private self: boolean;

    constructor() {
    }

    /**
     * Returns a survey and then removes the data
     */
    public getSurvey(): Survey {
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
    public setSurvey(survey: Survey): void {
        this.survey = survey;
    }

    /**
     * Set if the preview is viewed on itself
     * @param self
     * Component is either viewed as a preview in the editor or viewed alone
     */
    public setSelf(self: boolean) {
        this.self = self;
    }

    public getSelf(): boolean {
        return this.self;
    }
}

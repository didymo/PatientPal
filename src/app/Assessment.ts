import {Choice} from './Choice';

/**
 * This class will be used to store the mosaiq assessments that have been recieved from drupal
 */
export class Assessment {
    // The ID of an assessment
    // Used to identify with assessment ID stored in drupa
    id: number;

    // Stores the assessment type
    asessmentType: number;

    assessmentDesc: string;
    choices: Choice[];

    constructor(id: number, assessmentType: number, assessmentDesc: string) {
        this.id = id;
        this.asessmentType = assessmentType;
        this.assessmentDesc = assessmentDesc;
        this.choices = new Array();
    }

    addChoice(temp: Choice): void {
        this.choices.push(new Choice(
            temp.id,
            temp.choiceDesc
        ));
    }

    setAssessmentDescription(temp: string): void {
        this.assessmentDesc = temp;
    }
}

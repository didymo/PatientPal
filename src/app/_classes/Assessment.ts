import {Choice} from './Choice';
/**
 * Used to store the mosaiq assessments that have been received from drupal
 * Assessments are defined by their id, type, description, and an array of choices
 * This format has been defined within Drupal, so that once Survey has been converted into a JSON string
 * It can match the data in Drupal
 * @author Peter Charles Sims
 */
export interface Assessment {

    assessmentId: string;
    assessmentVid: string;
    assessmentLabel: string;
    assessmentDescription: string;
    assessmentType: string;
    assessmentCode: string;
    assessmentUuid: string;
    assessmentDelta: string;
    assessmentRequired: string;
    assessmentDisplayType: string;
    assessmentAnswer: string;
    assessmentChoices: Choice[];

}

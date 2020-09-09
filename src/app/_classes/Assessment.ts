import {Choice} from './Choice';
/**
 * Used to store the mosaiq assessments that have been received from drupal
 * Assessments are defined by their id, type, description, and an array of choices
 * This format has been defined within Drupal, so that once Survey has been converted into a JSON string
 * It can match the data in Drupal
 * @author Peter Charles Sims
 */
export interface Assessment {

    id: string;
    assessmentVid: string;
    assessmentLabel: string;
    description: string;
    assessmentType: string;
    assessmentCode: string;
    assessmentUuid: string;
    delta: string;
    required: string;
    displayType: string;
    assessmentAnswer: string;
    choices: Choice[];

}

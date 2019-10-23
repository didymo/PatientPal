import {PChoice} from './PChoice';

/**
 * Stores information of assessment payload
 * @author Peter Charles Sims
 */
export interface PAssessment {
    id: string;
    assessmentDesc: string;
    assessmentDelta: string;
    assessmentDisplayType: string;
    assessmentRequired: string;
    choices: PChoice[];

}
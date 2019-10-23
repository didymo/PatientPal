import {PAssessment} from './PAssessment';

/**
 * Stores informaiton of the TabView for the payload
 * @author Peter Charles Sims
 */
export interface PTabview {
    tabId: string;
    tabDesc: string;
    assessments: PAssessment[];
}
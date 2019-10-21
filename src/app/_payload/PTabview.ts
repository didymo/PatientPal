import {PAssessment} from './PAssessment';

export interface PTabview {
    tabId: string;
    tabDesc: string;
    assessments: PAssessment[];
}
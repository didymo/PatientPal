import {PChoice} from './PChoice';

export interface PAssessment {
    id: string;
    assessmentDesc: string;
    assessmentDelta: string;
    assessmentDisplayType: string;
    assessmentRequired: string;
    choices: PChoice[];

}
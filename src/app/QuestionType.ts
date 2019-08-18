/**
 * This interface will store the data of the questions returned from the tab view
 */
export interface QuestionType {
    tabViewLabel: string;
    assessmentCode: string;
    assessmentDescription: string;
    assessmentType: number;
    assessmentLabel: string;
    assessmentUuid: string;
    choiceCode: boolean;
    choiceDescription: string;
    choiceLabel: string;
    choiceUuid: string;
    assessmentId: number;
    tabViewId: number;
    choiceId: number;
}

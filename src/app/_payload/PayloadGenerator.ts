import {TabView} from '../_classes/TabView';
import {PTabview} from './PTabview';
import {PAssessment} from './PAssessment';
import {Assessment} from '../_classes/Assessment';
import {PChoice} from './PChoice';

export class PayloadGenerator {

    tabview: TabView;
    ptabview: PTabview;
    passessments: PAssessment[];

    constructor(tabview: TabView) {
        this.tabview = tabview;
    }

    public genPayload(): string {
        this.sortAssessments();
        this.ptabview = {
            tabId: this.tabview.tabViewId,
            tabDesc: this.tabview.tabViewLabel,
            assessments: this.passessments
        };
        return JSON.stringify(this.ptabview);
    }

    public sortAssessments(): void {
        this.passessments = this.tabview.assessments.map((element => {
            return {
                id: element.assessmentId,
                assessmentDesc: element.assessmentDescription,
                assessmentDelta: element.assessmentDelta,
                assessmentDisplayType: element.assessmentDisplayType,
                assessmentRequired: element.assessmentRequired,
                choices: this.sortChoices(element)
            }
        }));
    }

    public sortChoices(element: Assessment): PChoice[] {
        let tmp = [];
        if (element.assessmentType === '4') {
            return
        } else {
            tmp = element.assessmentChoices.map((element => {
                return {
                    id: element.choiceId,
                    choiceDelta: element.choiceDelta,
                    choiceDesc: element.choiceDescription
                };
            }))
        }
        return tmp;
    }
}
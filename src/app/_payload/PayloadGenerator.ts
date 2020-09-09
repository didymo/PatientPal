import {TabView} from '../_classes/TabView';
import {PTabview} from './PTabview';
import {PAssessment} from './PAssessment';
import {Assessment} from '../_classes/Assessment';
import {PChoice} from './PChoice';

/**
 * This class provides functionality to generate a payload
 * @author Peter Charles Sims
 */
export class PayloadGenerator {

    tabview: TabView;
    ptabview: PTabview;
    passessments: PAssessment[];

    /**
     * Construcotr fo payload generator
     * @param tabview
     * TabView that will be used to gen the payload
     */
    constructor(tabview: TabView) {
        this.tabview = tabview;
    }

    /**
     * Generates the payload
     */
    public genPayload(): string {
        this.sortAssessments();
        this.ptabview = {
            tabId: this.tabview.entityId,
            tabDesc: this.tabview.label,
            assessments: this.passessments
        };
        // Change made by Ashley chasing json bug
       // console.log(this.ptabview);
        return JSON.stringify(this.ptabview);
       // return this.ptabview;
    }

    /**
     * Sorts the assessments out
     */
    public sortAssessments(): void {
        this.passessments = this.tabview.assessments.map((element => {
            return {
                id: element.id,
                assessmentDesc: element.description,
                assessmentDelta: element.delta,
                assessmentDisplayType: element.displayType,
                assessmentRequired: element.required,
                choices: this.sortChoices(element)
            }
        }));
    }

    /**
     * Sorts the choices out
     * @param element
     * The Assessment being iterated
     */
    public sortChoices(element: Assessment): PChoice[] {
        let tmp = [];
        if (element.assessmentType === '4') {
            return
        } else {
            tmp = element.choices.map((element => {
                return {
                    id: element.id,
                    choiceDelta: element.delta,
                    choiceDesc: element.description
                };
            }))
        }
        return tmp;
    }
}

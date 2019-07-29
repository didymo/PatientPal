/**
 * This class will store the data of the survey
 */
import {Assessment} from './Assessment';

export class Survey {
  tabId: number;
  tabDesc: string;
  assessments: Assessment [];
  constructor(tabId: number, tabDesc: string) {
    this.tabId = tabId;
    this.tabDesc = tabDesc;
    this.assessments = new Array();
  }

  addAssessment(temp: Assessment) {
    this.assessments.push(temp);
  }
}

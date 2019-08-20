import {Assessment} from './Assessment';

/**
 * Contains all the assessments and choices that have been imported from Drupal
 * The format of this class has been defined in Drupal, so that it can easily be converted into a JSON string
 * And update the corresponding data in Drupal
 */
export class Survey {
  /**
   * The entity ID of the imported tab view
   * Used to uniquely identify the data in Drupal
   */
  tabId: number;

  /**A description of the imported tabview*/
  tabDesc: string;

  /**An array of all the assessments that are held within a tab view*/
  assessments: Assessment [];

  /**
   * Constructor for Survey class
   * @param tabId
   * The entity ID of a tabview
   * @param tabDesc
   * The tabview description
   */
  constructor(tabId: number, tabDesc: string) {
    this.tabId = tabId;
    this.tabDesc = tabDesc;
    this.assessments = new Array(); // Creates an instance of an array
  }

  /**
   * Pushes an assessment into the assessment array
   * @param assessment
   * A tabview assessment
   */
  public addAssessment(assessment: Assessment) {
    this.assessments.push(assessment);
  }
}

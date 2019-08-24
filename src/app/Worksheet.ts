/**
 * The drupal data that will be exported as an xlsx worksheet
 */
export class Worksheet {
    /**
     * The label of a tabview
     * Used to display the name of the tabview
     */
    tabViewLabel: string;
    /**
     * The ID of the actual tab view
     * Used to uniquely identify which tabview questions and choices are associated with will be updated
     */
    tabViewId: number;
    /**
     * An Assessment's ID.
     * Used to uniquely identify which assessment will be updated
     */
    assessmentId: number;

    /**
     * The description of an assessment
     */
    assessmentDescription: string;
    /**
     * An assessment's type
     * Type 5 has options
     * Type 4 has no options
     */
    assessmentType: number;
    /**
     * Assessment Label
     * The actual title of an assessment
     */
    assessmentLabel: string;
    /**
     * The ID of the choice
     * Used to uniquely identify which choice will be updated
     */
    choiceId: number;
    /**
     * The description of a choice
     * Stores the description of a choice
     */
    choiceDescription: string;
    /**
     * A choice's label
     */
    choiceLabel: string;

    /**
     * Choice's unique ID
     */

    /**
     * Constructor for Worksheet class
     * @param tabViewLabel
     * @param tabViewId
     * @param assessmentId
     * @param assessmentDescription
     * @param assessmentType
     * @param assessmentLabel
     * @param choiceId
     * @param choiceDescription
     * @param choiceLabel
     */
    constructor(tabViewLabel: string, tabViewId: number, assessmentId: number, assessmentDescription: string, assessmentType: number, assessmentLabel: string, choiceId: number, choiceDescription: string, choiceLabel: string) {
        this.tabViewLabel = tabViewLabel;
        this.tabViewId = tabViewId;
        this.assessmentId = assessmentId;
        this.assessmentDescription = assessmentDescription;
        this.assessmentType = assessmentType;
        this.assessmentLabel = assessmentLabel;
        this.choiceId = choiceId;
        this.choiceDescription = choiceDescription;
        this.choiceLabel = choiceLabel;
    }
}

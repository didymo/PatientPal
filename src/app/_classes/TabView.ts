/**
 * Stores the complete set of data associated with a tabview
 * Maintains the format defined by Drupal
 */
export interface TabView {
    /**
     * The label of a tabview
     * Used to display the name of the tabview
     */
    tabViewLabel: string;
    /**
     * The code of an assessment
     */
    assessmentCode: string;
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
     * The unique id of an assessment
     */
    assessmentUuid: string;
    /**
     * Stores the code of a choice
     */
    choiceCode: boolean;
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
    choiceUuid: string;
    /**
     * An Assessment's ID.
     * Used to uniquely identify which assessment will be updated
     */
    assessmentId: number;
    /**
     * The ID of the actual tab view
     * Used to uniquely identify which tabview questions and choices are associated with will be updated
     */
    tabViewId: number;
    /**
     * The ID of the choice
     * Used to uniquely identify which choice will be updated
     */
    choiceId: number;
}

/**
 * This class store the choices that have been imported from Drupal
 * This format has been defined within Drupal, so that once Survey has been converted into a JSON string
 * It can match the data in Drupal
 */
export class Choice {
    /**
     * The ID of a choice
     * Used to uniquely identify the choice stored in Drupal
     */
    id: number;
    /**
     * The description of a choice
     */
    choiceDesc: string;

    /**
     * Constructor for Choice class
     * @param id
     * The ID of a choice
     * @param choiceDesc
     * The description of a choice
     */
    constructor(id: number, choiceDesc: string) {
        this.id = id;
        this.choiceDesc = choiceDesc;
    }

    /**
     * This function sets a new choice description
     * @param choiceDescription
     * The description of a choice
     */
    public setChoiceDescription(choiceDescription: string): void {
        this.choiceDesc = choiceDescription;
    }

}

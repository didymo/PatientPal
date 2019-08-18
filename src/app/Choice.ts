/**
 * This class stores the choices that a user can alter when making a survey
 */
export class Choice {
    // This Id is used to refer to the ID of a mosaiq choice
    id: number;

    // This description stores the description of a given choice
    choiceDesc: string;

    constructor(id: number, choiceDesc: string) {
        this.id = id;
        this.choiceDesc = choiceDesc;
    }

    /**
     * This function sets a new choice description
     * @param temp
     * Temp is the new string that will be used to alter the current choice description
     */
    public setChoice(temp: string): void {
        this.choiceDesc = temp;
    }

}

import {Survey} from './survey';

/**
 * This class extends survey and will be used to store the entity of an
 * Assessment Type 5 Question
 */
export class SelectOne extends Survey {

    choiceDescription: string []; // The description of a choice
    choiceId: string []; // The ID of a choice


    constructor(id: string, assessmentType: number, assessmentDesc: string) {
        super(id, assessmentType, assessmentDesc);
        this.choiceDescription = ['d'];
        this.choiceId = ['d'];

    }


    addChoice(choiceDescription: string, choiceId: string, position: number): void {
        // super.addChoice(choiceDescription, choiceId, position);

        this.choiceDescription[position] = choiceDescription;
        this.choiceId[position] = choiceId;
    }

    getChoice(): string [] {
        super.getChoice();
        return this.choiceDescription;
    }
}

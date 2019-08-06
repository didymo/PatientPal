import {Choice} from './Choice';

export class Assessment {

    id: string;
    assessmentType: number;
    assessmentDesc: string;
    choices: Choice[];

    constructor(id: string, assessmentType: number, assessmentDesc: string) {
        this.id = id;
        this.assessmentType = assessmentType;
        this.assessmentDesc = assessmentDesc;
        this.choices = new Array();
    }

    addChoice(temp: Choice): void {
        this.choices.push(new Choice(
            temp.id,
            temp.choiceDesc
        ));
    }

}

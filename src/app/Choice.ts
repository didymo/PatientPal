export class Choice {
    id: string;
    choiceDesc: string;
    constructor(id: string, choiceDesc: string) {
        this.id = id;
        this.choiceDesc = choiceDesc;
    }

    setChoice(temp: string): void {
        this.choiceDesc = temp;
    }
}

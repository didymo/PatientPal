export class Choice {
    id: number;
    choiceDesc: string;

    constructor(id: number, choiceDesc: string) {
        this.id = id;
        this.choiceDesc = choiceDesc;
    }

    setChoice(temp: string): void {
        this.choiceDesc = temp;
    }
}

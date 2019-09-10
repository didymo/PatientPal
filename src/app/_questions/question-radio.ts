import {QuestionBase} from './question-base';
import {Choice} from '../_classes/Choice';

export class RadioQuestion extends QuestionBase<string> {
    controlType = 'radio';
    options: { key: string, value: string }[] = [];

    constructor(options: {} = {}, choices: Choice[]) {
        super(options);
        this.options = options['options'] || [];
        choices.forEach((choice, index) => {
            this.options[index].key = choice.id.toString();
            this.options[index].value = choice.choiceDesc;
        });
    }
}

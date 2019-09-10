import {QuestionBase} from './question-base';
import {Choice} from '../_classes/Choice';
import {element} from 'protractor';

export class DropdownQuestion extends QuestionBase<string> {
    controlType = 'dropdown';
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

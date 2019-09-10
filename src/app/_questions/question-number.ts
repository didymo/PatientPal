import {QuestionBase} from './question-base';

export class NumberQuestion extends QuestionBase<string> {
    controlType = 'number';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}

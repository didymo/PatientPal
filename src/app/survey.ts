/**
 * This class will store the data of the survey
 */
export class Survey {
  id: string;
  assessmentType: number;
  assessmentDesc: string;
  constructor(id: string, assessmentType: number, assessmentDesc: string) {
    this.id = id;
    this.assessmentType = assessmentType;
    this.assessmentDesc = assessmentDesc;
  }

  addChoice(choiceDescription: string, choiceId: string, position: number): void {

  }

  getChoice(): string[] {
    return;
  }
}

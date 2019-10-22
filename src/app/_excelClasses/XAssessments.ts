
export class XAssessments {
    assessmentId: string;
    assessmentVid: string;
    assessmentLabel: string;
    assessmentDescription: string;
    assessmentType: string;
    assessmentCode: string;
    assessmentUuid: string;
    assessmentDelta: string;
    assessmentRequired: string;
    assessmentDisplayType: string;


    constructor(assessmentId: string, assessmentVid: string, assessmentLabel: string, assessmentDescription: string, assessmentType: string, assessmentCode: string, assessmentUuid: string, assessmentDelta: string, assessmentRequired: string, assessmentDisplayType: string) {
        this.assessmentId = assessmentId;
        this.assessmentVid = assessmentVid;
        this.assessmentLabel = assessmentLabel;
        this.assessmentDescription = assessmentDescription;
        this.assessmentType = assessmentType;
        this.assessmentCode = assessmentCode;
        this.assessmentUuid = assessmentUuid;
        this.assessmentDelta = assessmentDelta;
        this.assessmentRequired = assessmentRequired;
        this.assessmentDisplayType = assessmentDisplayType;
    }
}
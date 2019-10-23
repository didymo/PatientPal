/**
 * Used to export assessments to excel
 * @author Peter Charles Sims
 */
export class XAssessments {
    /**
     * ID of an assessment
     */
    assessmentId: string;
    /**
     * Vid of an assessment
     */
    assessmentVid: string;
    /**
     * The label of an assessment
     */
    assessmentLabel: string;
    /**
     * The description of an assessment
     */
    assessmentDescription: string;
    /**
     * The assessment type
     */
    assessmentType: string;
    /**
     * The assessment code
     */
    assessmentCode: string;
    /**
     * Assessment UUID
     */
    assessmentUuid: string;
    /**
     * The delta of an assessment
     */
    assessmentDelta: string;
    /**
     * The assessment required
     */
    assessmentRequired: string;
    /**
     * The display type of an assessment
     */
    assessmentDisplayType: string;

    /**
     * Constructor for XAssessment Class
     * @param assessmentId
     * @param assessmentVid
     * @param assessmentLabel
     * @param assessmentDescription
     * @param assessmentType
     * @param assessmentCode
     * @param assessmentUuid
     * @param assessmentDelta
     * @param assessmentRequired
     * @param assessmentDisplayType
     */
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
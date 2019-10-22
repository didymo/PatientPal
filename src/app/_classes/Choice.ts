/**
 * This class store the choices that have been imported from Drupal
 * This format has been defined within Drupal, so that once Survey has been converted into a JSON string
 * It can match the data in Drupal
 */
export interface Choice {
    choiceId: string;
    choiceVid: string;
    choiceLabel: string;
    choiceDescription: string;
    choiceCode: string;
    choiceDelta: string;
    choiceUuid: string;
}

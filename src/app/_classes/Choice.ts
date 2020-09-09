/**
 * This class store the choices that have been imported from Drupal
 * This format has been defined within Drupal, so that once Survey has been converted into a JSON string
 * It can match the data in Drupal
 * @author Peter Charles Sims
 */
export interface Choice {
    id: string;
    choiceVid: string;
    label: string;
    description: string;
    choiceCode: string;
    delta: string;
    choiceUuid: string;
}

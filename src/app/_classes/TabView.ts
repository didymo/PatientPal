/**
 * Stores the complete set of data associated with a tabview
 * Maintains the format defined by Drupal
 * @author Peter Charles Sims
 */
import {Assessment} from './Assessment';

export interface TabView {

    // The label of a tab-view
    label: string;
    // The id of a tab-view
    entityId: string;
    // The VID of a tab-view
    tabViewVid: string;
    // The created time of a tab-view
    tabViewCreatedTime: string;
    // The changed time of a tab-view
    tabViewChangedTime: string;
    // An array of assessments associated with a tab-view
    assessments: Assessment[];

}

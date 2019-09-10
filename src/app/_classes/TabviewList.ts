/**
 * Stores the data of a TabView retrieved from the list of TabViews
 * Maintains the format defined from Drupal
 */
export interface TabviewList {
    /**
     * Tabview's label
     */
    label: string;
    /**
     * The entity id of a tab view
     * Uniquely identifies the tabview drupal
     */
    entityId: number;
    /**
     * TabviewList obdID
     */
    obdId: number;
    /**
     * TabView Parent View
     */
    parentView: number;
    /**
     * TabView KoboFormID
     */
    koboFormId: string;
}

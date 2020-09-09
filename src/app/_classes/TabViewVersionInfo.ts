/**
 * Stores information on tabview verisions
 * @author Paul Tunbridge
 */
export interface TabViewVersionInfo
{
    /**
    * revision tabview label
    **/
    tabViewLabel: string;

    /**
    * ID of the tabview
    **/
    entityId: number;

   /**
    *
    * ID of the tabview version (the revisionId)
    *
    **/
    tabViewVId: number;

    /**
     * The time a TabView was created
     * TODO: This should really be an date
     */
     tabViewCreatedTime: string;

    /**
     * The time a TabView Revision was created
     * TODO: This should really be an date
     */
     tabViewChangedtime: Date;
}

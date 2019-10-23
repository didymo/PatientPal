/**
 * Stores relevant information for tabview verions
 * @author Paul Tunbridge
 */
export interface TabViewVersion
{
    /**
    *
    * ID of the version number
    *
    **/
    id: number;
    /**
    *
    * ID of the tabview
    *
    **/
    tabid: number;
    /**
     * The status of a TabView
     * Used to display the status (published, draft etc)
     * TODO: This should really be an enum
     */
    revisionStatus: string;
    /**
     * The timestamp of a TabView
     * Used to display the time a TabView version was created
     * TODO: This should really be a datetime
     */
     revisionTimestamp: Date;
}

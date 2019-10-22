// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    surveysURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/tabview/edit',
    drupalURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/tab/list?_format=json',
    tabViewURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/content/tab/get/',
    publishURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/tabview/publish',
  formServerDeployed: 'http://mysite.com/get-deployed',
  formServerURL: 'http://mysite.com/',
  formServerApplicationURL: 'http://localhost:4201/form/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  surveysURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/tabview/edit',
  surveyVersionsURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/tabview/list/',
  drupalURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/tab/list?_format=json',
  tabViewURL: 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/content/tab/get/',
  formServerURL: 'http://qadrupal.lan.sesahs.nsw.gov.au:81/',
  formServerApplicationURL: 'http://localhost:4200/form/'
  };
  
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

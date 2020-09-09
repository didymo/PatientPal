// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  surveysURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/tabview/edit',
  drupalURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/rest/tab/list?_format=json',
  tabViewURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/rest/content/tab/get/',
  tabViewVersionURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/rest/content/tab/',
  publishURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/tabview/publish',
  versionURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/tabview/list/',
  deploySurveyURL: 'https://qadrupal.lan.sesahs.nsw.gov.au/rest/survey/deploy/',
  formServerDeployed: 'https://formhandler.didymodesigns.com.au/get-deployed',
  formServerURL: 'https://formhandler.didymodesigns.com.au/',
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

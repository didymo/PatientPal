// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    surveysURL: 'https://drupal.didymodesigns.com.au/tabview/edit',
    drupalURL: 'https://drupal.didymodesigns.com.au/rest/tab/list?_format=json',
    tabViewURL: 'https://drupal.didymodesigns.com.au/rest/content/tab/get/',
    tabViewVersionURL: 'https://drupal.didymodesigns.com.au/rest/content/tab/',
    publishURL: 'https://drupal.didymodesigns.com.au/tabview/publish',
    versionURL: 'https://drupal.didymodesigns.com.au/tabview/list/',
  deploySurveyURL: 'https://drupal.didymodesigns.com.au/rest/survey/deploy/',
  formServerDeployed: 'https://formserver.didymodesigns.com.au/get-deployed',
  formServerURL: 'https://formserver.didymodesigns.com.au/',
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

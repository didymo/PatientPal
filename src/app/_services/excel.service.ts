import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {TabView} from '../_classes/TabView';
import {XAssessments} from '../_excelClasses/XAssessments';
import {element} from 'protractor';
import {Choice} from '../_classes/Choice';
import {Assessment} from '../_classes/Assessment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})

/**
 * Service class that exports xlsx files to the clients machine.
 */
export class ExcelService {

    private tabView;

    private excelId: number;

    private translationName: string;

    private choicePos = 0;

    constructor() {
    }

    /**
     * Exports the given json string into an excel file on the client's machine
     * @param assessments
     * JSON payload that will be used to create the XLSX file
     * @param fileName
     * Name of the file
     */
    public exportExcelFile(tabView: TabView, fileName: string): void {
        let choiceSheet = [];

        let assessmentSheet = tabView.assessments.map((element) => {
            if(element.assessmentType === '4') {
                choiceSheet.push('');
            } else {
                element.assessmentChoices.forEach((element, index, array) => {
                    choiceSheet.push(element);
                });
            }
            return new XAssessments(
                element.assessmentId,
                element.assessmentVid,
                element.assessmentLabel,
                element.assessmentDescription,
                element.assessmentType,
                element.assessmentCode,
                element.assessmentUuid,
                element.assessmentDelta,
                element.assessmentRequired,
                element.assessmentDisplayType
            );
        });
        let tabSheet =[];
        tabSheet [0] = {
            "tabViewLabel": tabView.tabViewLabel,
            "tabViewId": tabView.tabViewId,
            "tabViewVid": tabView.tabViewVid,
            "tabViewCreatedTime": tabView.tabViewCreatedTime,
            "tabViewChangedTime": tabView.tabViewChangedTime
        };

        const tabviewWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tabSheet);
        const assessmentWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assessmentSheet);
        const choiceWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(choiceSheet);

        let workbook: XLSX.WorkBook = {
            Sheets:
                {'tabview': tabviewWorksheet, 'assessments': assessmentWorksheet, 'choices': choiceWorksheet},
            SheetNames: ['tabview', 'assessments', 'choices']
        };

        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

        this.saveAsExcelFile(excelBuffer, fileName);
    }

    /**
     * Saves as excel file
     * @param buffer
     * The buffer
     * @param fileName
     * Name of the file
     */
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    public setExcelData(tabviewData: any[], assessmentData: any[], choiceData: any[] ,id: number): void {

        let obj: TabView = {
            tabViewLabel: tabviewData[0].tabViewLabel,
            tabViewId: tabviewData[0].tabViewId,
            tabViewVid: tabviewData[0].tabViewVid,
            tabViewCreatedTime: tabviewData[0].tabViewCreatedTime,
            tabViewChangedTime: tabviewData[0].tabViewChangedTime,
            assessments: assessmentData.map((element) => {
                return {
                    assessmentId: element.assessmentId,
                    assessmentVid: element.assessmentVid,
                    assessmentLabel: element.assessmentLabel,
                    assessmentDescription: element.assessmentDescription,
                    assessmentType: element.assessmentType,
                    assessmentCode: element.assessmentCode,
                    assessmentUuid: element.assessmentUuid,
                    assessmentDelta: element.assessmentDelta,
                    assessmentRequired: element.assessmentRequired,
                    assessmentDisplayType: element.assessmentDisplayType,
                    assessmentChoices: this.sortChoices(choiceData, element.assessmentType)
                };
            })
        };
        this.excelId = id;

        console.log(obj);
    }
    public setTranslation(translation: string): void {
        this.translationName = translation;
    }

    public sortChoices(choiceData: any[], type: string) :Choice[] {
        let tmpChoice = [];
        let next = false;
        let index = this.choicePos;

        while(next === false) {
            if(type === '4') {
                return;
            } else if (choiceData[index].choiceDelta === '0' && tmpChoice.length === 0 || choiceData[index].choiceDelta != '0') {
                tmpChoice.push( {
                    choiceId: choiceData[index].choiceId,
                    choiceVid: choiceData[index].choiceVid,
                    choiceLabel: choiceData[index].choiceLabel,
                    choiceDescription: choiceData[index].choiceDescription,
                    choiceCode: choiceData[index].choiceCode,
                    choiceDelta: choiceData[index].choiceDelta,
                    choiceUuid: choiceData[index].choiceUuid,
                });
                index++;
            } else {
                next = true;
            }
        }
        return tmpChoice;
    }

    public getExcelData(): TabView {
        let tmp = this.tabView;
        this.clearData();
        return tmp;
    }

    public clearData() {
        this.tabView = undefined;
    }

    public getID(): number {
        return this.excelId;
    }

    public getTranslationName(): string {
        return this.translationName;
    }
}



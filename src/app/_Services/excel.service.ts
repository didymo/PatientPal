import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})

/**
 * Service class that exports xlsx files to the clients machine.
 */
export class ExcelService {

    /**This will be the data gathered from the excel file*/
    private excelData: any[];


    constructor() {
    }

    /**
     * Exports the given json string into an excel file on the client's machine
     * @param assessments
     * JSON payload that will be used to create the XLSX file
     * @param fileName
     * Name of the file
     */
    public exportExcelFile(assessments: any[], fileName: string): void {

        const assessmentWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assessments);


        let workbook: XLSX.WorkBook = {
            Sheets:
                {'data': assessmentWorksheet}, SheetNames: ['data']
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

    public setExcelData(blob: any[]): void {
        this.excelData = blob;
    }

    public getExcelData(): any [] {
        let tmp = this.excelData;
        return tmp;
        this.clearData();
    }

    public clearData() {
        this.excelData = undefined;
    }
}



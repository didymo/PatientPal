import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ExcelService} from '../_services/excel.service';
import * as XLSX from 'xlsx';

export interface DialogData {
    animal: string;
    name: string;
}
@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    name: string;

    constructor(
        public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    /**
     * Handle the dialog window
     * This window displays a single input in which a user will enter the path to their file
     * A path is chosen, it will call importXLSX file.
     */
    openDialog(): void {
        const dialogRef = this.dialog.open(NewTabViewDialog, {
            height: '35%',
            width: '40%',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


}

@Component({
    selector: 'new-tab-view-dialog',
    templateUrl: 'new-tab-view-dialog.html',
    styleUrls: ['new-tab-view-dialog.css']
})
export class NewTabViewDialog {

    arrayBuffer: any;
    tabBlob: any[];
    assessmentBlob: any[];
    choiceBlob: any[];
    entityId: number;
    translationName;

    constructor(
        public dialogRef: MatDialogRef<NewTabViewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private excelService: ExcelService) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    closeDialog(): void {
        this.translationName = (document.getElementById('languageInput') as HTMLInputElement).value;
        this.dialogRef.close();
        this.sendData();
    }

    /**
     * Handles the event of when a user selects an XLSX file to be imported
     * @param e
     */
    public handleFile(e): void {
        let files = e.target.files, f = files[0];
        let reader = new FileReader();

        reader.onload = (e) => {
            this.arrayBuffer = reader.result;
            let data = new Uint8Array(this.arrayBuffer);
            let arr = new Array();
            for (let i = 0; i != data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            let bstr = arr.join('');
            let workbook = XLSX.read(bstr, {type: 'binary'}); // Read in the excel file
            let tabview_sheet = workbook.SheetNames[0]; // Get the first worksheet in the excel file
            let assessment_sheet = workbook.SheetNames[1]; // Get the first worksheet in the excel file
            let choice_sheet = workbook.SheetNames[2]; // Get the first worksheet in the excel file
            let worksheet = workbook.Sheets[tabview_sheet]; // Create the worksheet
            let worksheet2 = workbook.Sheets[assessment_sheet]; // Create the worksheet
            let worksheet3 = workbook.Sheets[choice_sheet]; // Create the worksheet
            this.tabBlob = XLSX.utils.sheet_to_json(worksheet, {raw: true}); // Create the blob
            this.assessmentBlob = XLSX.utils.sheet_to_json(worksheet2, {raw: true}); // Create the blob
            this.choiceBlob = XLSX.utils.sheet_to_json(worksheet3, {raw: true}); // Create the blob

            this.entityId = this.tabBlob[0].tabViewId; // Get the entity ID from the excel sheet
        };
        reader.readAsArrayBuffer(f);

        document.getElementById('fileSelector').addEventListener('change', this.handleFile, false);
    }

    /**
     * Send the excel data to the excel service
     */
    public sendData(): void {
        let id = this.tabBlob[0].tabViewId;
        this.excelService.setExcelData(this.tabBlob, this.assessmentBlob, this.choiceBlob, id);
        this.excelService.setTranslation(this.translationName);
    }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ExcelService} from '../Services/excel.service';
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
            height: '30%',
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
    blob: any[];
    entityId: number;

    constructor(
        public dialogRef: MatDialogRef<NewTabViewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private excelService: ExcelService) {
    }

    onNoClick(): void {
        this.dialogRef.close();
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
            let workbook = XLSX.read(bstr, {type: 'binary'});
            let first_sheet_name = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[first_sheet_name];
            this.blob = XLSX.utils.sheet_to_json(worksheet, {raw: true});
            this.entityId = this.blob[0].tabViewId;
            this.sendData();

        };
        reader.readAsArrayBuffer(f);

        document.getElementById('fileSelector').addEventListener('change', this.handleFile, false);
    }

    public sendData(): void {
        this.excelService.setExcelData(this.blob);
    }

}

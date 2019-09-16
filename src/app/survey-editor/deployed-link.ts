import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from './survey-details.component';

@Component({
    selector: 'deployed-link',
    templateUrl: 'deployed-link.html'
})

export class DeployedLink {

    link = this.data.link;

    constructor(
        public dialogRef: MatDialogRef<DeployedLink>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        console.log(this.link);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    copyText() {
        let copyText = (document.getElementById('link') as HTMLInputElement);

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand('copy');
    }
}

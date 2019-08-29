import { Component, OnInit } from '@angular/core';

// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /**
   * Handle the popup window
   * This window displays a single input in which a user will enter the path to their file
   * A path is chosen, it will call importXLSX file.
   */
  public triggerPopup(): void {
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(NavBarComponent, {
  //     width: '250px',
  //     data: {}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  /**
   * Handles the importing of XLSX files
   */
  public importXLSX(): void {

  }

}

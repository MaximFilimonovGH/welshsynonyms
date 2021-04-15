import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-hint-dialog',
  templateUrl: './hint-dialog.component.html',
  styleUrls: ['./hint-dialog.component.css']
})
export class HintDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  synonymList: any[];
  isWelsh;
  synonymsText;

  ngOnInit(): void {
    console.log(this.data);
    this.synonymList = this.data.synonymList;
    this.isWelsh = this.data.isWelsh;
    if (this.isWelsh) {
      this.synonymsText = "Cyfystyron";
    } else {
      this.synonymsText = "Synonyms";
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
  }

}

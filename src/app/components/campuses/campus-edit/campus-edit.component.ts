import { Component, Inject } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Campuses } from '../../../models/Campuses.model';
@Component({
  selector: 'app-campus-edit',
  templateUrl: './campus-edit.component.html',
  styleUrl: './campus-edit.component.css'
})
export class CampusEditComponent {
  newName:string = '';
  constructor(private dialogRef: MatDialogRef<CampusEditComponent>,@Inject(MAT_DIALOG_DATA) public data: any){}

  closeDialog(){
    this.dialogRef.close()
  }

  update(){
    var updatedCampus:Campuses = new Campuses();

    updatedCampus.Id = this.data.campus.id;
    updatedCampus.campusesName = this.newName;
    this.dialogRef.close(updatedCampus);
  }
}

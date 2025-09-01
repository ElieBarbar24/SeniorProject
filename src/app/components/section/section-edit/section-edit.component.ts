import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { InstructorEditComponent } from '../../instructors/instructor-edit/instructor-edit.component';

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrl: './section-edit.component.css'
})
export class SectionEditComponent implements OnInit{
  dbInstructors:any[] = [];
  dbRooms:any[]=[];
  selectedInstructor:string='';
  selectedRoom:string='';

  constructor(private api:ApiService,private dialogRef: MatDialogRef<InstructorEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    this.selectedRoom = this.data.section.roomId;
    this.selectedInstructor = this.data.section.instID;
    console.log(data);
  }
  ngOnInit(): void {
    this.getInstructors();
    this.getRooms();
  }

  getInstructors(){
    this.api.getInst().subscribe({
      next:(data)=>{
        this.dbInstructors = data;
        console.log(this.dbInstructors);
      }
    })
  }

  getRooms(){
    this.api.getRoomsData().subscribe({
      next:(data)=>{
        this.dbRooms = data;
        console.log(this.dbRooms);
      }
    })
  }

  onClose(){
    this.dialogRef.close();
  }

  onSave(){
    var updatedSection:any = {
      Id:this.data.section.id,
      instId:this.selectedInstructor,
      roomId:this.selectedRoom
    }
    this.dialogRef.close(updatedSection);
  }
}

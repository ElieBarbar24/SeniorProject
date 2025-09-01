import { Component, Inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstructorEditComponent } from '../../instructors/instructor-edit/instructor-edit.component';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.css'
})
export class RoomEditComponent {
  roomNum:string;
  roomType:string;
  block:string;
  sectionLimit:number;
  examLimit:number;
  campus:string;
  priority:number;
  roomExamAvailability:boolean;
  constructor(private api:ApiService,private dialogRef: MatDialogRef<RoomEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.roomNum = data.room.roomNum;
    this.roomType = data.room.type;
    this.block = data.room.block;
    this.sectionLimit = data.room.sectionStudentLimit;
    console.log(data);
    this.examLimit = data.room.examStudentLimit;
    this.campus = data.room.campus;
    this.priority = data.room.examPriority;
    this.roomExamAvailability = data.room.roomExamAvailability;
  }

  

  onClose(){
    this.dialogRef.close();
  }

  onSave(){
    var updatedRoom:any = {
      Id:this.data.room.id,
      roomNum:this.roomNum,
      Type:this.roomType,
      Block:this.block,
      SectionStudentLimit:this.sectionLimit,
      ExamStudentLimit:this.examLimit,
      campusID:this.campus,
      roomExamPriority:this.priority,
      nbColumns:this.data.nbColumns,
      nbRows:this.data.nbRows,
      roomExamAvailability:this.roomExamAvailability,

    }

    this.dialogRef.close(updatedRoom);
  }
}

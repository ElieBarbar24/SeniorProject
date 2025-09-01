import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ApiService } from '../../../services/api.service';
import { InstructorEditComponent } from '../../instructors/instructor-edit/instructor-edit.component';

@Component({
  selector: 'app-exam-schedule-edit',
  templateUrl: './exam-schedule-edit.component.html',
  styleUrl: './exam-schedule-edit.component.css'
})
export class ExamScheduleEditComponent implements OnInit{
  instructorUserName:string = '';
  examId:any;
  dbInstructors:any[]=[];
  dbProctors:any[]=[];
  proctorsNames:any;
  chiefProctorId:any;
  constructor(private api:ApiService,private dialogRef: MatDialogRef<InstructorEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    console.log(data);
    this.examId = data.exam.examId
    this.chiefProctorId = data?.exam?.chiefProctor?.id ?? null;
  }

  ngOnInit():void{
    console.log(this.examId);
    this.getInstructors();
    this.getProctors();
  }

  onChiefCheckboxChange(instructor: { id: number, name: string }): void {
    this.chiefProctorId = this.chiefProctorId === instructor.id ? null : instructor.id;
  }

  getInstructors(){
    var exam:ExamIdRequest = new ExamIdRequest();
    exam.examId = this.data.exam.examId;

    this.api.getInstructorsForProctoring(exam).subscribe({
      next:(data)=>{
        this.dbInstructors = data;
        console.log(data);
      }
    })
  }
  onClose(){
    this.dialogRef.close();
  }

  getProctors(){
    var exam:ExamIdRequest = new ExamIdRequest();
    exam.examId = this.data.exam.examId;
    this.api.getExamProctorsSingle(exam).subscribe({
      next:(data)=>{
        this.dbProctors = data;
        console.log(data);
      }
    })
  }

  onSave(){
    var format:UpdateProctoringFormat = new UpdateProctoringFormat();
    format.chiefProctorId = this.chiefProctorId!=null? this.chiefProctorId:0;
    format.proctorsIds = this.dbProctors;
    format.examId = this.examId;

    console.log(format);
    this.dialogRef.close(format);
  }

  onCheckboxChange(instructor: { id: number, name: string }, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      if (!this.dbProctors.includes(instructor.id)) {
        this.dbProctors.push(instructor.id);
      }
    } else {
      const index = this.dbProctors.indexOf(instructor.id);
      if (index > -1) {
        this.dbProctors.splice(index, 1);
      }
    }
  
    console.log(this.dbProctors);
  }
  
  
}

export class ExamIdRequest{
  examId:any|undefined;
}

export class UpdateProctoringFormat{
  examId:any|undefined;
  proctorsIds:any|undefined;
  chiefProctorId:any|undefined;
}
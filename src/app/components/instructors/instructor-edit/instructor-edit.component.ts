import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstructorRequest } from '../../../models/Instructor.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-instructor-edit',
  templateUrl: './instructor-edit.component.html',
  styleUrl: './instructor-edit.component.css'
})
export class InstructorEditComponent implements OnInit{
  dbSchools:any[]=[];
  dbCampuses:any[]=[]

  selectedDepartement:string='';
  selectedSchool:string='';
  selectedCampus:string='';
  instProctoringAvailibility:boolean=true;

  fname:string;
  mname:string;
  lname:string;
  title:string;
  email:string;

  constructor(private api:ApiService,private dialogRef: MatDialogRef<InstructorEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fname = data.instructor.fname;
    this.mname = data.instructor.mname;
    this.lname = data.instructor.lname;
    this.title = data.instructor.title;
    this.email = data.instructor.email;
    this.instProctoringAvailibility = data.instructor.proctoringAvailibility;
  }

  onClose(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
      this.getSchools();
      this.getCampuses();
  }

  getSchools(){
    this.api.getSchools().subscribe({
      next:(data)=>{
        console.log(data);
        this.dbSchools = data;
      }
    })
  }
  getSelectedSchoolDepartments(): any[] | undefined {
    const selectedSchoolObject = this.dbSchools.find(s => s.schoolName === this.selectedSchool);
    return selectedSchoolObject ? selectedSchoolObject.departments : undefined;
  }

  getCampuses(){
    this.api.getCampuses().subscribe({
      next:(data)=>{
        console.log(data);
        this.dbCampuses = data;
      }
    })
  }

  onSave(){
    var updatedInstructor:any = {
      Id:this.data.instructor.id,
      fname:this.fname,
      mname:this.mname,
      lname:this.lname,
      username:this.data.instructor.username,
      title:this.title,
      email:this.email,
      depId:this.selectedDepartement,
      proctoringAvailibility:this.instProctoringAvailibility
    }

    if(this.selectedDepartement==''){
      updatedInstructor.depId = this.data.instructor.depId;
    }
    this.dialogRef.close(updatedInstructor);
  }
}
/**[Key] public int Id { get; set; }
public string fname { get; set; }
public string mname { get; set; }
public string lname { get; set; }
public string username { get; set; }
public string title { get; set; }
public string email { get; set; }

public int depId { get; set; }
public Departement departement { get; set; }

public List<Section> sections { get; set; }
public List<Campuses> campuses { get; set; } */
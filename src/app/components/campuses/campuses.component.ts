import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../../services/excel.service';
import { ApiService } from '../../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { Campuses } from '../../models/Campuses.model';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog,MatDialogConfig} from "@angular/material/dialog";
import { CampusEditComponent } from './campus-edit/campus-edit.component';
import { Pagination } from '../../models/Pagination.model';

@Component({
  selector: 'app-campuses',
  templateUrl: './campuses.component.html',
  styleUrl: './campuses.component.css'
})
export class CampusesComponent implements OnInit{
  campuses:any = [];
  campusName:string = '';
  dbcampuses:any[] =[];
  toastDuration: number = 5000;
  role!: string;
  allowedRoles:string[] = ['SuperAdmin','Admin'];

  campusPages:Pagination = new Pagination();

  constructor(private dialog:MatDialog,private excel:ExcelService,private api:ApiService,private toast:NgToastService,private userStore:UserStoreService, private auth: AuthService){}
  ngOnInit(): void {
    this.getCampuse();
    this.userStore.getRole().subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    });
  }

  readCampuses(event:any):void{
    const file = event.target.files[0];

    if(file){
      const validExtensions = ['.xls', '.xlsx'];
      const fileName = file.name.toLowerCase();
      const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      if (!isValidExtension) {
        this.toast.error({ detail: "ERROR", summary: "Invalid file type. Please select an Excel file.", duration: this.toastDuration });
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }


      this.excel.excelToArray(file).then((data)=>{
        
        var check = this.CampusesFileFormatValidator(data);
        
        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format for Campuses.", duration: this.toastDuration });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }

        this.campuses = data
      });
    }
  }

  CampusesFileFormatValidator(campuses: any): boolean {
    var titles: any = campuses[0];
    var fileTitles: any = ['CampusId', 'Campus']
    for (let t of Object.keys(titles)) {
      if (!fileTitles.includes(t)) {
        return false;
      }
    }
    return true
  }

  createAPICampuses():Campuses[]{
    var newCampuses: Campuses[]=[]
    for(let campus of this.campuses){
      var newCampuse:Campuses = new Campuses();
      newCampuse.campusesName = campus['Campus'];

      newCampuses.push(newCampuse);
    }
    return newCampuses;
  }

  uploadOneCampus(){
    if(this.campusName==""){
      this.toast.error({ detail: "ERROR", summary: "Make sure to write the campus name before uploading it", duration: this.toastDuration });
    }
    this.campusName = this.campusName.charAt(0).toUpperCase() + this.campusName.slice(1).toLowerCase();
    var campuses:Campuses[] = [];
    var campus:Campuses = new Campuses();
    campus.campusesName = this.campusName;
    campuses.push(campus);
    
    
    this.api.setCampuses(campuses).subscribe({
      next:(value)=>{
        this.toast.success({ detail: "Success", summary: "Campus uploaded successfully", duration: this.toastDuration });
        this.getCampuse();
      },
      error:(error)=>{
        this.toast.error({ detail: "ERROR", summary: error.error.message, duration: this.toastDuration });
      }
    })

    this.campusName = "";
  }

  uploadExcelCampusesData(){
    var campuses:Campuses[] = this.createAPICampuses();
    campuses = campuses.slice(1);
    this.api.setCampuses(campuses).subscribe({
      next:(res)=>{
        this.toast.success({ detail: "Success", summary: "Campuses uploaded successfully", duration: this.toastDuration });
        this.getCampuse();
      },
      error:(res)=>{
        this.toast.error({ detail: "ERROR", summary: "Error occured during uploading Campuses", duration: this.toastDuration });
      }
    });

    this.getCampuse();
  }

  getCampuse(){
    this.api.getCampuses().subscribe(
      res=>{
        this.dbcampuses = res;
        var page:number = res.length;
        this.campusPages.genPages(page);
      }
    )
  }

  onEdit(item:any){
    const dialogRef = this.dialog.open(CampusEditComponent, {
      disableClose: true,
      autoFocus: true,
      enterAnimationDuration: '0.2s',
      data: {
        campus: item,
      },
      panelClass: 'mat-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        var updatedCampus:Campuses = result;
        if(updatedCampus.campusesName==''||updatedCampus.Id==null){
          this.toast.error({detail:"ERROR",summary:"Missing Data To Update Campus"})
          return;
        }
        else{
          this.api.updateCampus(updatedCampus).subscribe({
            next:(res)=>{
              this.getCampuse();
              this.toast.success({ detail: "Success", summary: "Campuses Updated successfully", duration: this.toastDuration });
            },
            error:(error)=>{
              this.toast.error({ detail: "ERROR", summary: error.error.message, duration: this.toastDuration });
            }
          })
        }
      } else {
      }
    });
  }

}


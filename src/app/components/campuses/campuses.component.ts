import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../../services/excel.service';
import { ApiService } from '../../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { Campuses } from '../../models/Campuses.model';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-campuses',
  templateUrl: './campuses.component.html',
  styleUrl: './campuses.component.css'
})
export class CampusesComponent implements OnInit{
  campuses:any = [];

  dbcampuses:any=[];
  toastDuration: number = 2500;
  role!: string;
  constructor(private excel:ExcelService,private api:ApiService,private toast:NgToastService,private userStore:UserStoreService, private auth: AuthService){}
  ngOnInit(): void {
    this.getCampuse();
    this.userStore.getRole().subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    })
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

  uploadExcelCampusesData(){
    var campuses:Campuses[] = this.createAPICampuses();
    campuses = campuses.slice(1);
    this.api.setCampuses(campuses).subscribe({
      next:(res)=>{
        this.toast.success({ detail: "Succes", summary: "Campuses uploaded successfully", duration: this.toastDuration });
        this.getCampuse();
      },
      error:(res)=>{
        this.toast.error({ detail: "ERROR", summary: "Error occured during uploading Campuses", duration: this.toastDuration });
      }
    });
  }

  getCampuse(){
    this.api.getCampuses().subscribe(
      res=>{
        this.dbcampuses = res;
        console.log(res);
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../../services/api.service';
import { ExcelService } from '../../services/excel.service';
import { Room } from '../../models/Room.model';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { Pagination } from '../../models/Pagination.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit{
  dbRooms:any[] = [];
  ExcelRooms:any[] = [];

  toastDuration: number = 5000;

  isCampusData:boolean = false;
  roomsPages:Pagination = new Pagination();

  roomType:string[] =[];
  selectedType: string = 'All Types';
  
  roomBlock:string[] = [];
  selectedBlock: string = 'All Blocks';

  roomcampus:string[]=[]
  selectedCampus: string = 'All Campuses';

  allowedRoles:string[] = ['SuperAdmin','Admin'];
  role!:string;

  constructor(private auth:AuthService,private userstore:UserStoreService,private toast:NgToastService,private api:ApiService,private excel:ExcelService){}

  ngOnInit(): void {
    this.userstore.getRole()
      .subscribe(val=>{
        const roleFromToken = this.auth.getRoleFromToke();
        this.role = val || roleFromToken;
      })
    this.getCampuse();
    this.getRooms();
  }
  getCampuse() {
    this.api.getCampuses().subscribe(
      res => {
        if (res.length == 0) {
          this.isCampusData = false;
        } else {
          this.isCampusData = true;
        }
      }
    )
  }

  createFilerUniqueValues(){
    this.roomType = Array.from(new Set(this.dbRooms?.map(i=>i['type'])));
    this.roomBlock = Array.from(new Set(this.dbRooms?.map(i=>i['block'])));
    this.roomcampus = Array.from(new Set(this.dbRooms?.map(i=>i['campus'])));
  }

  readRoomsFromExcel(event:any):void{
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
        var check = this.RoomsFileFormatValidator(data);
        if(!check){
          this.toast.error({detail:"ERROR",summary:"Invalid Excel Format For Rooms File"});
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }
        this.ExcelRooms = data;
      });
    }
  }

  RoomsFileFormatValidator(rooms:any):boolean{
    var titles :any = rooms[0];
    var fileTitles: any = ['roomId','roomNum','max','roomLimit','roomNote','roomBlock','campus','Room Type'];
    var keys = Object.keys(titles);
    console.log(keys);
    if(keys.length !=fileTitles.length){
      return false;
    }

    for(let key of keys){
      if(!fileTitles.includes(key)){
        return false;
      }
    }
    return true
  }
  createAPIRooms():Room[]{
    var rooms:Room[] = [];
    for(let item of this.ExcelRooms){
      var newRoom:Room = new Room();
      newRoom.roomNum = item['roomNum'];
      newRoom.SectionStudentLimit = item['max'];
      newRoom.ExamStudentLimit = item['roomLimit'];
      newRoom.Type = item['Room Type'];
      newRoom.Block = item['roomBlock'];
      newRoom.campusID = 0;
      if(item['Room Type']=='office'){
        newRoom.roomExamAvailability = false;
      }
      else{
        newRoom.roomExamAvailability = true;
      }
      rooms.push(newRoom);
    }

    rooms = rooms.slice(1);
    return rooms;
  }

  createAPICampusRooms():CampusRooms[]{
    var campusRooms:CampusRooms[] = [];
    for(let item of this.ExcelRooms){
      var newCampusRoom:CampusRooms = new CampusRooms();

      newCampusRoom.campusName = item['campus'];
      newCampusRoom.roomNum = item['roomNum'];


      campusRooms.push(newCampusRoom);
    }
    campusRooms=campusRooms.slice(1);
    return campusRooms;
  }
  
  uploadRooms(){
    if(this.isCampusData){
      var rooms:Room[] = this.createAPIRooms();
      var campusRooms:CampusRooms[] = this.createAPICampusRooms();

      var request:RoomsUploadRequest = new RoomsUploadRequest;
      request.rooms = rooms;
      request.roomsCampuses = campusRooms;
      if(rooms.length == 0){
        this.toast.error({detail:"ERROR",summary:"You Need To upload The Rooms Excel File first",duration:this.toastDuration})
        return;
      }
      
      this.api.setRooms(request).subscribe({
        next:(value)=>{
          this.getRooms();
          this.toast.success({detail:"Success",summary:"Rooms Uploading Successfuly",duration:this.toastDuration});
        },
        error:(err)=>{
          this.toast.error({detail:"ERROR",summary:"Server Error",duration:this.toastDuration});
        }
      })
    }else{
      this.toast.error({detail:"ERROR", summary:"You Need To upload Campuses First"});
    }
  }

  getRooms(){
    this.api.getRoomsData().subscribe({
      next:(data)=>{
        this.dbRooms =data;
        if(this.dbRooms.length!==0)
          this.roomsPages.genPages(this.dbRooms?.length)
      }
    })
  }
  
}

export class CampusRooms{
  campusName:string |undefined;
  roomNum:string | undefined;
}

export class RoomsUploadRequest{
  rooms:Room[]|undefined;
  roomsCampuses:CampusRooms[]|undefined;
}

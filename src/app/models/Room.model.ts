export class Room{
    Id:number |undefined;
    roomNum:string | undefined;
    ExamStudentLimit:number | undefined;
    SectionStudentLimit:number | undefined;
    Type:string | undefined;
    Block:string | undefined;
    nbColumns:string |undefined;
    nbRows: string |undefined;
    roomExamAvailability:boolean|undefined;
    campusID:number |undefined|null;
}

/*[Key] public int Id { get; set; }
public string roomNum { get; set; }
public int ExamStudentLimit {  get; set; }
public int SectionStudentLimit { get; set; }
public string Type { get; set; }
public string Block { get; set; }
public int nbColumns { get; set; }
public int nbRows { get; set; } 
public bool roomExamAvailability { get; set; }
*/
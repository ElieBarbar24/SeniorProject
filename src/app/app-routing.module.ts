import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { ExamSchedulerComponent } from './components/SectionAndCoursesUploader/exam-scheduler.component';
import { CoursesComponent } from './components/courses/courses.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { InformationComponent } from './components/information/information.component';
import { CampusesComponent } from './components/campuses/campuses.component';
import { SchoolsComponent } from './components/schools/schools.component';
import { DepartmentsComponent } from './components/departments/departments.component';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'DashBoard', component: DashboardComponent, canActivate: [AuthGuard] ,children:[
    {path:'',component:AdminComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'scheduler', component: ExamSchedulerComponent},
    {path:'course',component:CoursesComponent},
    {path:'instructors',component:InstructorsComponent},
    {path:'room',component:RoomsComponent},
    {path:'information',component:InformationComponent,children:[
      {path:'',component:CampusesComponent},
      {path:'Campuses',component:CampusesComponent},
      {path:'Schools',component:SchoolsComponent},
      {path:'Departement',component:DepartmentsComponent}
    ]},

  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
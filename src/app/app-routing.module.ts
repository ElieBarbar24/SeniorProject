import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { CoursesComponent } from './components/courses/courses.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { CampusesComponent } from './components/campuses/campuses.component';
import { SectionComponent } from './components/section/section.component';
import { AdminsCreatorComponent } from './components/admins-creator/admins-creator.component';
import { ExamScheduleComponent } from './components/exam-schedule/exam-schedule.component';
import { InformationComponent } from './components/information/information.component';
import { StatisticsComponent } from './components/statistics/statistics.component';




const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'DashBoard', component: DashboardComponent, canActivate: [AuthGuard] ,children:[
    {path:'',redirectTo:'Schedule',pathMatch:'full'},
    {path:'Admins',component:AdminsCreatorComponent},
    {path:'Information',component:InformationComponent},
    {path:'Instructors',component:InstructorsComponent},
    {path:'Section',component:SectionComponent},
    {path:'Room',component:RoomsComponent},
    {path:'Schedule',component:ExamScheduleComponent},
    {path:'Course',component:CoursesComponent},
    {path:'Statistics',component:StatisticsComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
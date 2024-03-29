//Modules 
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgToastModule } from 'ng-angular-popup';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import {DataTablesModule} from 'angular-datatables'
import { FormsModule } from '@angular/forms';
import {MatTable} from '@angular/material/table'
import { ModalModule } from 'ngx-bootstrap/modal';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ExamSchedulerComponent } from './components/SectionAndCoursesUploader/exam-scheduler.component'
import { ActiveLinkServiceService } from './services/active-link-service.service';
import { CoursesComponent } from './components/courses/courses.component';
import { InstructorsComponent , } from './components/instructors/instructors.component';
import { CampusesComponent } from './components/campuses/campuses.component';
import { SectionComponent } from './components/section/section.component';
import { AdminsCreatorComponent } from './components/admins-creator/admins-creator.component';
import { ExamScheduleComponent } from './components/exam-schedule/exam-schedule.component';
import { CampusEditComponent } from './components/campuses/campus-edit/campus-edit.component';
import { InstructorEditComponent } from './components/instructors/instructor-edit/instructor-edit.component';
//Interceptors
import { TokenInterceptor } from './interceptors/token.interceptor';

//Provider
import { RoomsComponent } from './components/rooms/rooms.component';
import { SchoolsComponent } from './components/schools/schools.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { InformationComponent } from './components/information/information.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SidebarComponent,
    ExamSchedulerComponent,
    RoomsComponent,
    CoursesComponent,
    InstructorsComponent,
    CampusesComponent,
    SectionComponent,
    AdminsCreatorComponent,
    ExamScheduleComponent,
    CampusEditComponent,
    InstructorEditComponent,
    SchoolsComponent,
    DepartmentsComponent,
    InformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    DataTablesModule,
    FormsModule,
    MatTable,
    ModalModule.forRoot(),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }, ActiveLinkServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
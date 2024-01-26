import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgToastModule } from 'ng-angular-popup';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './components/admin/admin.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { ExamSchedulerComponent } from './components/SectionAndCoursesUploader/exam-scheduler.component'
import { ActiveLinkServiceService } from './services/active-link-service.service';
import { RoomsComponent } from './components/rooms/rooms.component';
import { CoursesComponent } from './components/courses/courses.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { InformationComponent } from './components/information/information.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CampusesComponent } from './components/campuses/campuses.component';
import { SchoolsComponent } from './components/schools/schools.component';
import { DepartmentsComponent } from './components/departments/departments.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,


    SidebarComponent,
    AdminComponent,
    ExamSchedulerComponent,
    RoomsComponent,
    CoursesComponent,
    InstructorsComponent,
    InformationComponent,
    CampusesComponent,
    SchoolsComponent,
    DepartmentsComponent,
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
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true
  },ActiveLinkServiceService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard'; 
import { UserProfileViewComponent } from './user-profile-view/user-profile-view.component';
import { EinkaufenComponent } from './einkaufen/einkaufen.component';
import { SportComponent } from './sport/sport.component';
import { TreffenComponent } from './treffen/treffen.component';
import { FeierComponent } from './feier/feier.component';
import { EigenesComponent } from './eigenes/eigenes.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'einkaufen', component: EinkaufenComponent, canActivate: [AuthGuard] },
  { path: 'sport', component: SportComponent, canActivate: [AuthGuard] },        
  { path: 'treffen', component: TreffenComponent, canActivate: [AuthGuard] },   
  { path: 'feier', component: FeierComponent, canActivate: [AuthGuard] },        
  { path: 'eigenes', component: EigenesComponent, canActivate: [AuthGuard] },    
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } 
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EinkaufenComponent,
    UserProfileViewComponent,
    SportComponent,      
    TreffenComponent,    
    FeierComponent,      
    EigenesComponent     
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

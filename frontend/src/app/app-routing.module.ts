import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; 
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { EinkaufenComponent } from './einkaufen/einkaufen.component';
import { UserProfileViewComponent } from './user-profile-view/user-profile-view.component';
import { SportComponent } from './sport/sport.component';
import { TreffenComponent } from './treffen/treffen.component';
import { FeierComponent } from './feier/feier.component';
import { EigenesComponent } from './eigenes/eigenes.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'einkaufen', component: EinkaufenComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'sport', component: SportComponent, canActivate: [AuthGuard] },        
  { path: 'treffen', component: TreffenComponent, canActivate: [AuthGuard] },    
  { path: 'feier', component: FeierComponent, canActivate: [AuthGuard] },        
  { path: 'eigenes', component: EigenesComponent, canActivate: [AuthGuard] },    
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

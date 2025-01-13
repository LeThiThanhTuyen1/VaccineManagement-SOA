import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { VaccineManagementComponent } from './component/vaccine-management/vaccine-management.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent },
  { path: 'vaccines', component: VaccineManagementComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

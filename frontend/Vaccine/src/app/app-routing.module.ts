import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserListComponent } from './component/admin/user-list/user-list.component';
import { HomeManagerComponent } from './component/home-manager/home-manager.component';
import { AdminHomeComponent } from './component/admin/admin-home/admin-home.component';
import { AddUserComponent } from './component/admin/add-user/add-user.component';
import { RegistrationComponent } from './component/manager/registration/registration.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home-manager', component: HomeManagerComponent},
  { path: 'user-list', component: UserListComponent },
  { path: 'home-admin', component: AdminHomeComponent},
  { path: 'add-user', component: AddUserComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

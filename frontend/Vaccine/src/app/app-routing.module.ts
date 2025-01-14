import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserListComponent } from './component/admin/user-list/user-list.component';
import { HomeManagerComponent } from './component/manager/home-manager/home-manager.component';
import { AdminHomeComponent } from './component/admin/admin-home/admin-home.component';
import { AddUserComponent } from './component/admin/add-user/add-user.component';
import { RegistrationComponent } from './component/manager/registration/registration.component';
import { RegistrationListComponent } from './component/manager/registration-list/registration-list.component';
import { VaccineListComponent } from './component/admin/vaccine-list/vaccine-list.component';
import { AddVaccineComponent } from './component/admin/add-vaccine/add-vaccine.component';
import { VaccineDetailsComponent } from './component/admin/vaccine-details/vaccine-details.component';
import { EditVaccineComponent } from './component/admin/edit-vaccine/edit-vaccine.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home-manager', component: HomeManagerComponent},
  { path: 'user-list', component: UserListComponent },
  { path: 'home-admin', component: AdminHomeComponent},
  { path: 'add-user', component: AddUserComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'registration-list', component: RegistrationListComponent},
  { path: 'vaccine-list', component: VaccineListComponent },
  { path: 'vaccine-details/:id', component: VaccineDetailsComponent },
  { path: 'edit-vaccine/:id', component: EditVaccineComponent },
  { path: 'add-vaccine', component: AddVaccineComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

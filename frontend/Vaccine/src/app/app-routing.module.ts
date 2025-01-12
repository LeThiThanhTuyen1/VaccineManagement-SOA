import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { HomeManagerComponent } from './component/home-manager/home-manager.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home-manager', component: HomeManagerComponent},
  { path: 'users', component: UserListComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

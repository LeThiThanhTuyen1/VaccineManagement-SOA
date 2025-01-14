import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './component/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './component/admin/user-list/user-list.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './component/backet/header/header.component';
import { HomeManagerComponent } from './component/manager/home-manager/home-manager.component';
import { RouterModule } from '@angular/router';
import { AdminHomeComponent } from './component/admin/admin-home/admin-home.component';
import { AddUserComponent } from './component/admin/add-user/add-user.component';
import { RegistrationComponent } from './component/manager/registration/registration.component';
import { RegistrationListComponent } from './component/manager/registration-list/registration-list.component';
import { TokenInterceptor } from './service/token-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    HomeManagerComponent,
    UserListComponent,
    AdminHomeComponent,
    AddUserComponent,
    RegistrationComponent,
    RegistrationListComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot([])
  ],

  providers: [
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

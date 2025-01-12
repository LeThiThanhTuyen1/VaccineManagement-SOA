import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VaccineComponent } from './components/vaccine/vaccine.component';
import { ComponentsComponent } from './components/components.component';
import { EditComponent } from './components/vaccine/edit/edit.component';
import { ListComponent } from './components/vaccine/list/list.component';
import { HeaderComponent } from './components/backet/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    VaccineComponent,
    ComponentsComponent,
    EditComponent,
    ListComponent,
    HeaderComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

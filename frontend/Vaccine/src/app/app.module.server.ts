
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { NgModule } from '@angular/core';

// Angular SSR doesn't require `provideServerRoutesConfig` in most setups
@NgModule({
  imports: [
    AppModule,       
    ServerModule     
  ],
  bootstrap: [AppComponent] 
})
export class AppServerModule { }


import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Angular SSR doesn't require `provideServerRoutesConfig` in most setups
@NgModule({
  imports: [
    AppModule,       // Import your main application module
    ServerModule     // Enable server-side rendering support
  ],
  bootstrap: [AppComponent] // Bootstraps your root component
})
export class AppServerModule {}

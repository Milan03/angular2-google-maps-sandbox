import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapsService } from './services/map.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBiPZ2DrJuIXjozoLSAdk6iUAI_sz6OzMU',
      libraries: ['places']
    }),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/map',
        pathMatch: 'full'
      },
      {
        path: 'map',
        component: MapComponent
      }
    ])
  ],
  providers: [MapsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

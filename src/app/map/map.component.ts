import { Component, OnInit } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';

import { Location } from '../models/location';
import { User } from '../models/user';

@Component({
  moduleId: module.id,
  selector: 'my-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // Default map center
  centerLat: number = 37.4292;
  centerLng: number = -122.1381; 
  user: User;
    
  constructor() { }

  ngOnInit() {
    this.user = new User();
  }

  mapClicked($event: MouseEvent) {
    this.user.userLoc.lat = $event.coords.lat;
    this.user.userLoc.lng = $event.coords.lng;
    console.log("Lat: " +this.user.userLoc.lat +" Lang: " +this.user.userLoc.lng)
  }
}

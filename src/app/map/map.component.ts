import { Component, OnInit, NgZone } from '@angular/core';
import { MouseEvent, MapsAPILoader } from 'angular2-google-maps/core';

import { marker } from '../models/marker';
//import { User } from '../models/user';

declare var google: any;

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
  //user: User;
  marker: marker;
    
  constructor(
    private _loader: MapsAPILoader,
    private _zone: NgZone
  ) { }

  ngOnInit() {
    this.marker = new marker();
    this.autocomplete();
  }

  autocomplete() {
    this._loader.load().then(() => {
      var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this._zone.run(() => {
          var place = autocomplete.getPlace();

          this.marker.lat = place.geometry.location.lat();
          this.marker.lng = place.geometry.location.lng();
          this.marker.label = place.name;

          console.log(place);
        });
      });
    });
  }

  mapClicked($event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    console.log("Lat: " +this.marker.lat +" Long: " +this.marker.lng)
  }

}

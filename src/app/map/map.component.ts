import { Component, OnInit, NgZone } from '@angular/core';
import { MouseEvent, MapsAPILoader } from 'angular2-google-maps/core';

import { marker } from '../models/marker';
import { MapsService } from '../services/map.service'

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
    private _zone: NgZone,
    private _mapsService: MapsService
  ) { }

  ngOnInit() {
    this.marker = new marker();
    this.autocomplete();
    this.callCurrentPosition();
  }

  fillInputs(formatted_address:string) {
    let addrElements = formatted_address.split(",");
    let provPostalCode = addrElements[2].split(" ");
    this.marker.draggable = true;
    this.marker.label = formatted_address;
    this.marker.buildingNum = addrElements[0].substr(0,addrElements[0].indexOf(' '));
    this.marker.streetName = addrElements[0].substr(addrElements[0].indexOf(' ')+1);
    this.marker.city = addrElements[1].trim();
    this.marker.region =  provPostalCode[1];
    if (provPostalCode.length == 4)
      this.marker.postalCode =  provPostalCode[2]+provPostalCode[3];
    else if (provPostalCode.length == 3)
      this.marker.postalCode = provPostalCode[2];
    else
      this.marker.postalCode = "N/A";
  }

  autocomplete() {
    this._loader.load().then(() => {
      var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this._zone.run(() => {
          var place = autocomplete.getPlace();
          let rsltLength = 8;
          console.log(place);
          this.marker = new marker();
          this.marker.lat = place.geometry.location.lat();
          this.marker.lng = place.geometry.location.lng();
          this.fillInputs(place.formatted_address);
        });
      });
    });
  }

  callGeoLocation(lat: number, lng: number) {
    this._mapsService.getGeoLocation(lat, lng).subscribe(
      results => {
        this._zone.run(() => {
          this.fillInputs(results.formatted_address);
        })
      }
    )
  }

  callCurrentPosition() {
      this._mapsService.getCurrentPosition().subscribe( 
      position => {
        this._zone.run(() => {
          this.marker.lat = position.coords.latitude;
          this.marker.lng = position.coords.longitude;
          this.marker.draggable = true;
          this.callGeoLocation(this.marker.lat, this.marker.lng);
        });
      }
      );
  }

  mapClicked($event: MouseEvent) {
    this.marker = new marker();
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.callGeoLocation(this.marker.lat, this.marker.lng);    
    console.log("Lat: " +this.marker.lat +" Long: " +this.marker.lng)
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    this.marker = new marker();
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.callGeoLocation(this.marker.lat, this.marker.lng);
    console.log("Marker Dragged --> ");
    console.log("Lat: " +this.marker.lat +" Long: " +this.marker.lng)
  }

  clickedMarker(label: string) {
    
  }
}
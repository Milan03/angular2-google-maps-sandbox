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
    this.getCurrentPosition();
  }

  autocomplete() {
    this._loader.load().then(() => {
      var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this._zone.run(() => {
          var place = autocomplete.getPlace();
          this.marker = new marker();
          this.marker.lat = place.geometry.location.lat();
          this.marker.lng = place.geometry.location.lng();
          this.marker.label = place.name;
          console.log(place);
        });
      });
    });
  }

  getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };
        geocoder.geocode(request, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            let result = results[0];
            let rsltAdrComponent = result.address_components;
            let resultLength = rsltAdrComponent.length;
            if (result != null) {
              this.marker.buildingNum = rsltAdrComponent[resultLength-8].short_name;
              this.marker.streetName = rsltAdrComponent[resultLength-7].short_name;
              this.marker.label = result.formatted_address;
            } else {
              alert("No address available!");
            }
          }
        });
    }
  }

  getCurrentPosition() {
    let options = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition( (position) => {
      this.marker = new marker();
      this.marker.lat = position.coords.latitude;
      this.marker.lng = position.coords.longitude;
      this.marker.draggable = true;
      this.getGeoLocation(this.marker.lat, this.marker.lng);
    }, error => {
      console.log(error);
    }, options
    );
    
  }

  mapClicked($event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.getGeoLocation(this.marker.lat, this.marker.lng);    
    console.log("Lat: " +this.marker.lat +" Long: " +this.marker.lng)
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.getGeoLocation(this.marker.lat, this.marker.lng);
    console.log("Marker Dragged --> ");
    console.log("Lat: " +this.marker.lat +" Long: " +this.marker.lng)
  }

  clickedMarker(label: string) {
    
  }
}
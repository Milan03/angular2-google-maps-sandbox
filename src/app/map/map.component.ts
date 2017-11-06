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
    marker: marker;

    constructor(
        private _loader: MapsAPILoader,
        private _zone: NgZone,
        private _mapsService: MapsService
    ) {}

    ngOnInit() {
        this.marker = new marker();
        this.autocomplete();
        this.callCurrentPosition();
    }

    /**
     * Takes a resulted formatted address and seperates the different parts into their 
     * respective text-box field bindings.
     * @param {string} [formatted_address] Results formatted address to split.
     * @returns Nothing. Sets DOM objects.
     */
    fillInputs(formatted_address: string) {
        let addrElements = formatted_address.split(",");
        let provPostalCode = addrElements[2].split(" ");
        this.marker.draggable = true;
        this.marker.label = formatted_address;
        this.marker.buildingNum = addrElements[0].substr(0, addrElements[0].indexOf(' '));
        this.marker.streetName = addrElements[0].substr(addrElements[0].indexOf(' ') + 1);
        this.marker.city = addrElements[1].trim();
        this.marker.region = provPostalCode[1];
        if (provPostalCode.length == 4)
            this.marker.postalCode = provPostalCode[2] + provPostalCode[3];
        else if (provPostalCode.length == 3)
            this.marker.postalCode = provPostalCode[2];
        else
            this.marker.postalCode = "";
    }

    /**
     * Registers an event listener that is bound to a textbox. Exposes the Google API Autocomplete 
     * functionality.
     * @param None.
     * @returns Nothing. Listens for key strokes and invokes Google API functionality.
     */
    autocomplete() {
        let options = {
            componentRestrictions: {
                country: "ca"
            }
        };
        let input = document.getElementById("autocompleteInput");
        this._loader.load().then(() => {
            var autocomplete = new google.maps.places.Autocomplete(input, options);
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

    /**
     * Calls the MapsService reverse geocoding service.
     * @param {number} [lat] Number representing latitude to be passed to service.
     * @param {number} [lng] Number representing longitude to be passed to service.
     * @returns Nothing. Calls fillInputs() function to manipulate the DOM.
     */
    callRevGeoLocate(lat: number, lng: number) {
        this._mapsService.getRevGeoLocation(lat, lng).subscribe(
            results => {
                this._zone.run(() => {
                    this.fillInputs(results.formatted_address);
                });
            }
        );
    }

    /**
     * Calls the MapsService getCurrentPosition() service and updates the marker attributes.
     * @returns Nothing. Updates marker attributes and calls getRevGeoLocation() service.
     */
    callCurrentPosition() {
        this._mapsService.getCurrentPosition().subscribe(
            position => {
                this._zone.run(() => {
                    this.marker.lat = position.coords.latitude;
                    this.marker.lng = position.coords.longitude;
                    this.marker.draggable = true;
                    this.callRevGeoLocate(this.marker.lat, this.marker.lng);
                });
            }
        );
    }

    /**
     * Facilitates changes in marker as the user clicks the map to a different spot. Updates
     * the marker and its coords. Afterwards calls the getRevGeolocation() service to get 
     * position information and fill out textboxes.
     */
    mapClicked($event: MouseEvent) {
        this.marker = new marker();
        this.marker.lat = $event.coords.lat;
        this.marker.lng = $event.coords.lng;
        this.callRevGeoLocate(this.marker.lat, this.marker.lng);
        console.log("Lat: " + this.marker.lat + " Long: " + this.marker.lng)
    }

    /**
     * Faciliates changes in marker as the user drags the marker to a different spot on the map.
     * Updates the marker and its coords; calls getRevGeolocation() and fillInputs() to fill rest of
     * UI reqs.
     */
    markerDragEnd(m: marker, $event: MouseEvent) {
        this.marker = new marker();
        this.marker.lat = $event.coords.lat;
        this.marker.lng = $event.coords.lng;
        this.callRevGeoLocate(this.marker.lat, this.marker.lng);
        console.log("Marker Dragged --> ");
        console.log("Lat: " + this.marker.lat + " Long: " + this.marker.lng)
    }

    /**
     * Any extra functionality to be added for a marker click.
     */
    clickedMarker(label: string) {
        this.marker = new marker();
        this.marker.label = label;
        console.log(marker);
    }
}
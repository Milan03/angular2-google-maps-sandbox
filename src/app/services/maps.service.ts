import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable, Observer } from 'rxjs';

declare var google: any;

@Injectable()
export class MapsService extends GoogleMapsAPIWrapper {
    constructor(private __loader: MapsAPILoader, private __zone:NgZone) {
        super(__loader, __zone);
    }

    // From @vintesh - https://github.com/SebastianM/angular2-google-maps/issues/689
    getLatLong(address: string) {
        console.log('Getting address: ', address);
        let geocoder = new google.maps.Geocode();
        return Observable.create(observer => {
            geocoder.geocode( { 'address': address }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    console.log('Error: ', results, ' & Status: ', status);
                    observer.next();
                    observer.complete();
                }
            });
        })
    }
}
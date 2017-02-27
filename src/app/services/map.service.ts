import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable, Observer } from 'rxjs';

declare var google: any;

@Injectable()
export class MapsService extends GoogleMapsAPIWrapper {
    constructor(private __loader: MapsAPILoader, private __zone: NgZone) {
        super(__loader, __zone);
    }

    /**
     * Gets the coordingates (lat,lng) from a string address using Google API 
     * geocoding service.
     * @param {string} [address] String representation of the address to be geocoded.
     * @returns {Observable<any>} Location object which has coords attributes.
     */
    getGeoLocation(address: string): Observable<any> {
        console.log('Getting address: ', address);
        let geocoder = new google.maps.Geocode();
        return Observable.create(observer => {
            geocoder.geocode({
                'address': address
            }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    console.log('Error: ', results, ' & Status: ', status);
                    observer.error();
                }
            });
        });
    }

    /**
     * Back codes a point location (lat, lng) to readable address or place name.
     * @param {number} [lat] Angular distance of a place north/south of the equator.
     * @param {number} [lng] Angular distance of a place east/west of the meridian
     *                       at Greenwich, England.
     * @returns {Observable} Of GeocoderResult which has all the information necessary
     *                       to build a readable address/place name.
     */
    getRevGeoLocation(lat: number, lng: number): Observable<google.maps.GeocoderResult> {
        if (navigator.geolocation) {
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(lat, lng);
            let request = {
                latLng: latlng
            };
            return Observable.create(observer => {
                geocoder.geocode(request, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results[0]);
                        observer.next(results[0])
                        observer.complete();
                    } else {
                        console.log('Error: ', results, ' & Status: ', status);
                        observer.error();
                    }
                });
            });
        }
    }

    /**
     * Retrieves geographic position in terms of latitude and longitude of the device.
     * @returns {Observable<Position>} Geographical location of the device running 
     *                                 the client.
     */
    getCurrentPosition(): Observable<Position> {
        let options = {
            enableHighAccuracy: true
        };
        return new Observable((observer: Observer < Position > ) => {
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error: PositionError) => {
                    console.log('Geolocation service: ' + error.message);
                    observer.error(error);
                }, options
            );
        });
    }
}
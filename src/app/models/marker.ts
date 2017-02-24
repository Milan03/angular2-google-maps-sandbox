export class marker implements IMarker { 
    lat: number;
    lng: number;
    label: string;
    draggable: boolean;
    zoom: number;
    buildingNum?: string;
    streetName?: string;
    city?: string;
    region?: string;
    crossSt?: string;
    landMark?: string;
    postalCode?: string;

    constructor() {
        this.lat = 0;
        this.lng = 0;
        this.label = "";
        this.draggable = true;
        this.zoom = 0;
        this.buildingNum = "";
        this.streetName = "";
        this.city = "";
        this.region = "";
        this.crossSt = "";
        this.landMark = "";
        this.postalCode = "";
    }
}

interface IMarker {
    lat: number;
    lng: number;
    label: string;
    draggable: boolean;
    zoom: number;
}
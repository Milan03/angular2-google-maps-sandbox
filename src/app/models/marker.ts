export class marker implements ILatLng { 
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    buildingNum?: string;
    streetName?: string;
    city?: string;
    region?: string;
    crossSt?: string;
    landMark?: string;
    detail?: string;
}

interface ILatLng {
    lat: number;
    lng: number;
    draggable: boolean;
}
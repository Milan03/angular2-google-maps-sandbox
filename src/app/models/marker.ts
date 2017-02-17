export class marker implements IMarker { 
    lat: number;
    lng: number;
    label: string;
    draggable: boolean;
    buildingNum?: string;
    streetName?: string;
    city?: string;
    region?: string;
    crossSt?: string;
    landMark?: string;
    postalCode?: string;
}

interface IMarker {
    lat: number;
    lng: number;
    label: string;
    draggable: boolean;
}
import { LatLng } from "leaflet";
import { Nurse } from "../types/form";

export function filterBySelectedCoords(selectedCoords: LatLng | undefined) {
  return (nurse: Nurse) => {
    if (selectedCoords && nurse.latitude && nurse.latitude) {
      const [nurseLat, nurseLng] = [
        Number(nurse.latitude),
        Number(nurse.longitude),
      ];
      const { lat, lng } = selectedCoords;
  
      return (
        lat.toPrecision(4) === nurseLat.toPrecision(4) &&
        lng.toPrecision(4) === nurseLng.toPrecision(4)
      );
    }
  
    return true;
  }
}

export function filterBySpecialties(specialtiesFilter: string[]) {
  return (nurse: Nurse) => {
    if (specialtiesFilter.length > 0) {
      return (nurse.specialties || []).some((specialty) =>
        specialtiesFilter.includes(specialty)
      );
    }
  
    return true;
  }
}
import { atom } from "jotai";
import { LatLng } from "leaflet";
import { Nurse } from "../types/form";

export const nursesAtom = atom<Nurse[]>([])
export const filteredNursesAtom = atom<Nurse[]>([])
export const specialtiesFilterAtom = atom<string[]>([])
export const selectedNurseAtom = atom<Nurse | undefined>(undefined);
export const selectedCoordsAtom = atom<LatLng | undefined>(undefined);
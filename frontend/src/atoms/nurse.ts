import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { LatLng } from "leaflet";
import { FormType } from "../types/form";

export const nursesAtom = atomWithStorage<FormType[]>("nurses", [])
export const filteredNursesAtom = atom<FormType[]>([])
export const specialtiesFilterAtom = atom<string[]>([])
export const selectedNurseAtom = atom<FormType | undefined>(undefined);
export const selectedCoordsAtom = atom<LatLng | undefined>(undefined);
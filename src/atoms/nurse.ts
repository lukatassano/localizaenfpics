import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { LatLng } from "leaflet";
import { CompleteFormType } from "../types/form";

export const nursesAtom = atomWithStorage<CompleteFormType[]>("nurses", [])
export const filteredNursesAtom = atom<CompleteFormType[]>([])
export const specialtiesFilterAtom = atom<string[]>([])
export const selectedNurseAtom = atom<CompleteFormType | undefined>(undefined);
export const selectedCoordsAtom = atom<LatLng | undefined>(undefined);
import { atom } from "jotai";
import { CompleteFormType } from "../types/form";
import { atomWithStorage } from "jotai/utils";

export const nursesAtom = atomWithStorage<CompleteFormType[]>("nurses", [])
export const filteredNursesAtom = atomWithStorage<CompleteFormType[]>("nurses", [])
export const selectedNurseAtom = atom<CompleteFormType | undefined>(undefined);
import { atom } from "jotai";
import { PersonalDataFormType } from "../types/form";

export const formOpenAtom = atom(false);
export const personalDataFormAtom = atom<PersonalDataFormType | undefined>()

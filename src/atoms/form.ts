import { atom } from "jotai";
import { PersonalDataFormType } from "../types/form";

export const personalDataFormAtom = atom<PersonalDataFormType | undefined>()


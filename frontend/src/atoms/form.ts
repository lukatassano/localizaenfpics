import { atom } from "jotai";
import { FormType } from "../types/form";

export const formOpenAtom = atom(false);
export const personalDataFormAtom = atom<FormType | undefined>()

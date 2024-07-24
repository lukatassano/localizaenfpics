import { atom } from 'jotai';

export const activeStepAtom = atom(0);

export const handleNextAtom = atom(
  (get) => get(activeStepAtom),
  (get, set) => set(activeStepAtom, get(activeStepAtom) + 1)
);

export const handleBackAtom = atom(
  (get) => get(activeStepAtom),
  (get, set) => set(activeStepAtom, get(activeStepAtom) - 1)
);

export const handleResetAtom = atom(
  null,
  (_, set) => set(activeStepAtom, 0)
);

import { atom } from 'jotai';

export const activeStepAtom = atom(0.0);

export const handleNextAtom = atom(
  (get) => get(activeStepAtom),
  (get, set) => {
    set(activeStepAtom, get(activeStepAtom) + 0.4)
    setTimeout(() => {
      set(activeStepAtom, get(activeStepAtom) + 0.6)
    }, 500);
  }
);

export const handleBackAtom = atom(
  (get) => get(activeStepAtom),
  (get, set) => {
    set(activeStepAtom, get(activeStepAtom) - 0.4)
    setTimeout(() => {
      set(activeStepAtom, get(activeStepAtom) - 0.6)
    }, 500);
  }
);

export const handleResetAtom = atom(
  null,
  (_, set) => set(activeStepAtom, 0)
);

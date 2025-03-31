import create from "zustand";

export const useStore = create((set) => ({
  user: null,
  cycles: [],
  symptoms: [],
  privateKey: null,
  setUser: (user) => set({ user }),
  setCycles: (cycles) => set({ cycles }),
  setSymptoms: (symptoms) => set({ symptoms }),
  setPrivateKey: (privateKey) => set({ privateKey }),
}));

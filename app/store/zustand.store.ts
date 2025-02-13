import { create } from "zustand";

type Store = {
  id: string;
  email: string;
  name: string | null;
  setUser: (id: string, email: string, name: string | null) => void;
  resetUser: () => void;
};

const useStore = create<Store>((set) => ({
  id: "",
  email: "",
  name: null,
  setUser: (id, email, name) => set({ id, email, name }),
  resetUser: () => set({ id: "", email: "", name: null }),
}));

export default useStore;

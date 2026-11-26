import { create } from "zustand";
import { searchShows } from "../api/client";
import type { ShowSummary } from "../types/show";

type Status = "idle" | "loading" | "error" | "success";

interface SearchStore {
  query: string;
  shows: ShowSummary[];
  status: Status;
  errorMessage: string;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  shows: [],
  status: "idle",
  errorMessage: "",

  setQuery: (query) => set({ query }),

  search: async (query) => {
    set({ status: "loading", errorMessage: "", shows: [] });

    try {
      const shows = await searchShows(query);
      set({ shows, status: "success" });
    } catch (error) {
      set({
        errorMessage:
          error instanceof Error ? error.message : "Ha ocurrido un error.",
        status: "error",
      });
    }
  },
}));

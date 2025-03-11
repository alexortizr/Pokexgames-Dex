import create from 'zustand';
import type { EfficacyMap } from '../types';

/**
 * Firma de datos para mediaCatch
 */
interface MediaCatchRanges {
  pb: [number, number];
  gb: [number, number];
  sb: [number, number];
  ub: [number, number];
  be1: [number, number];
  be2: [number, number];
  be3: [number, number];
  be4: [number, number];
  sfb: [number, number];
}

type EffectivenessRecord = {
  [key: string]: string[];
};

interface FilterState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  clearAllFilters: () => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  selectedElements: string[];
  toggleElement: (el: string) => void;
  clearElements: () => void;

  selectedForms: string[];
  toggleForm: (frm: string) => void;
  clearForms: () => void;

  selectedRegions: string[];
  toggleRegion: (reg: string) => void;
  clearRegions: () => void;

  selectedClasses: string[];
  toggleClass: (cls: string) => void;
  clearClasses: () => void;

  selectedTiers: string[];
  toggleTier: (tier: string) => void;
  clearTiers: () => void;

  minLevel: number;
  maxLevel: number;
  setMinLevel: (val: number) => void;
  setMaxLevel: (val: number) => void;

  minXp: number;
  maxXp: number;
  setMinXp: (val: number) => void;
  setMaxXp: (val: number) => void;

  minNpcPrice: number;
  maxNpcPrice: number;
  setMinNpcPrice: (val: number) => void;
  setMaxNpcPrice: (val: number) => void;

  selectedDifficulties: string[];
  toggleDifficulty: (diff: string) => void;
  clearDifficulties: () => void;

  mediaCatch: MediaCatchRanges;
  setMediaCatchRange: (ballKey: keyof MediaCatchRanges, minVal: number, maxVal: number) => void;

  selectedAbilities: string[];
  toggleAbility: (ab: string) => void;
  clearAbilities: () => void;

  movesTerm: string;
  setMovesTerm: (val: string) => void;

  selectedMoveElements: string[];
  toggleMoveElement: (el: string) => void;
  clearMoveElements: () => void;

  selectedMoveTypes: string[];
  toggleMoveType: (t: string) => void;
  clearMoveTypes: () => void;

  selectedEffectiveness: EffectivenessRecord;
  toggleEffectiveness: (cat: string, el: string) => void;
  clearEffectivenessCategory: (cat: string) => void;

  lootTerm: string;
  setLootTerm: (val: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  clearAllFilters: () => set({
    searchTerm: '',
    selectedElements: [],
    selectedForms: [],
    selectedRegions: [],
    selectedClasses: [],
    selectedTiers: [],
    minLevel: 1,
    maxLevel: 9999,
    minXp: 0,
    maxXp: 9999999,
    minNpcPrice: 0,
    maxNpcPrice: 9999999,
    selectedDifficulties: [],
    mediaCatch: {
      pb: [0, 999999],
      gb: [0, 999999],
      sb: [0, 999999],
      ub: [0, 999999],
      be1: [0, 999999],
      be2: [0, 999999],
      be3: [0, 999999],
      be4: [0, 999999],
      sfb: [0, 999999],
    },
    selectedAbilities: [],
    movesTerm: '',
    selectedMoveElements: [],
    selectedMoveTypes: [],
    selectedEffectiveness: {
      Efectivo: [],
      "Muy efectivo": [],
      Normal: [],
      Inefectivo: [],
      "Muy Inefectivo": [],
      Inmune: [],
    },
    lootTerm: '',
    darkMode: false,
  }),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  selectedElements: [],
  toggleElement: (el) => set((state) => ({
    selectedElements: state.selectedElements.includes(el)
      ? state.selectedElements.filter((x) => x !== el)
      : [...state.selectedElements, el],
  })),
  clearElements: () => set({ selectedElements: [] }),

  selectedForms: [],
  toggleForm: (frm) => set((state) => ({
    selectedForms: state.selectedForms.includes(frm)
      ? state.selectedForms.filter((f) => f !== frm)
      : [...state.selectedForms, frm],
  })),
  clearForms: () => set({ selectedForms: [] }),

  selectedRegions: [],
  toggleRegion: (reg) => set((state) => ({
    selectedRegions: state.selectedRegions.includes(reg)
      ? state.selectedRegions.filter((r) => r !== reg)
      : [...state.selectedRegions, reg],
  })),
  clearRegions: () => set({ selectedRegions: [] }),

  selectedClasses: [],
  toggleClass: (cls) => set((state) => ({
    selectedClasses: state.selectedClasses.includes(cls)
      ? state.selectedClasses.filter((c) => c !== cls)
      : [...state.selectedClasses, cls],
  })),
  clearClasses: () => set({ selectedClasses: [] }),

  selectedTiers: [],
  toggleTier: (tier) => set((state) => ({
    selectedTiers: state.selectedTiers.includes(tier)
      ? state.selectedTiers.filter((t) => t !== tier)
      : [...state.selectedTiers, tier],
  })),
  clearTiers: () => set({ selectedTiers: [] }),

  minLevel: 1,
  maxLevel: 9999,
  setMinLevel: (val) => set({ minLevel: val }),
  setMaxLevel: (val) => set({ maxLevel: val }),

  minXp: 0,
  maxXp: 9999999,
  setMinXp: (val) => set({ minXp: val }),
  setMaxXp: (val) => set({ maxXp: val }),

  minNpcPrice: 0,
  maxNpcPrice: 9999999,
  setMinNpcPrice: (val) => set({ minNpcPrice: val }),
  setMaxNpcPrice: (val) => set({ maxNpcPrice: val }),

  selectedDifficulties: [],
  toggleDifficulty: (diff) => set((state) => ({
    selectedDifficulties: state.selectedDifficulties.includes(diff)
      ? state.selectedDifficulties.filter((d) => d !== diff)
      : [...state.selectedDifficulties, diff],
  })),
  clearDifficulties: () => set({ selectedDifficulties: [] }),

  mediaCatch: {
    pb: [0, 999999],
    gb: [0, 999999],
    sb: [0, 999999],
    ub: [0, 999999],
    be1: [0, 999999],
    be2: [0, 999999],
    be3: [0, 999999],
    be4: [0, 999999],
    sfb: [0, 999999],
  },
  setMediaCatchRange: (ballKey, minVal, maxVal) => set((state) => ({
    mediaCatch: {
      ...state.mediaCatch,
      [ballKey]: [minVal, maxVal],
    },
  })),

  selectedAbilities: [],
  toggleAbility: (ab) => set((state) => ({
    selectedAbilities: state.selectedAbilities.includes(ab)
      ? state.selectedAbilities.filter((x) => x !== ab)
      : [...state.selectedAbilities, ab],
  })),
  clearAbilities: () => set({ selectedAbilities: [] }),

  movesTerm: '',
  setMovesTerm: (val) => set({ movesTerm: val }),

  selectedMoveElements: [],
  toggleMoveElement: (el) => set((state) => ({
    selectedMoveElements: state.selectedMoveElements.includes(el)
      ? state.selectedMoveElements.filter((x) => x !== el)
      : [...state.selectedMoveElements, el],
  })),
  clearMoveElements: () => set({ selectedMoveElements: [] }),

  selectedMoveTypes: [],
  toggleMoveType: (t) => set((state) => ({
    selectedMoveTypes: state.selectedMoveTypes.includes(t)
      ? state.selectedMoveTypes.filter((x) => x !== t)
      : [...state.selectedMoveTypes, t],
  })),
  clearMoveTypes: () => set({ selectedMoveTypes: [] }),

  selectedEffectiveness: {
    Efectivo: [],
    "Muy efectivo": [],
    Normal: [],
    Inefectivo: [],
    "Muy Inefectivo": [],
    Inmune: [],
  },
  toggleEffectiveness: (cat, el) => set((state) => {
    const arr = state.selectedEffectiveness[cat] || [];
    let newArr = arr.includes(el) 
      ? arr.filter((x) => x !== el)
      : [...arr, el];
    return {
      selectedEffectiveness: {
        ...state.selectedEffectiveness,
        [cat]: newArr,
      },
    };
  }),
  clearEffectivenessCategory: (cat) => set((state) => ({
    selectedEffectiveness: {
      ...state.selectedEffectiveness,
      [cat]: [],
    },
  })),

  lootTerm: '',
  setLootTerm: (val) => set({ lootTerm: val }),
}));

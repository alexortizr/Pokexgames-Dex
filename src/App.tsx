import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { usePokemonData } from './hooks/usePokemonData';
import { useFilterStore } from './store/filterStore';
import FilterMenu from './components/FilterMenu';
import PokemonCard from './components/PokemonCard';
import { Pokemon } from './types';

export default function App() {
  const { pokemons, loading } = usePokemonData();
  const fStore = useFilterStore();

  const fuse = useMemo(() => {
    return new Fuse(pokemons, {
      keys: ['name', 'number'],
      threshold: 0.3,
    });
  }, [pokemons]);

  const filteredPokemons = useMemo(() => {
    let result: Pokemon[] = pokemons;

    // 1) name/number
    if (fStore.searchTerm.trim() !== '') {
      const fuseRes = fuse.search(fStore.searchTerm);
      result = fuseRes.map((r) => r.item);
    }

    // 2) elements
    if (fStore.selectedElements.length > 0) {
      result = result.filter((p) =>
        fStore.selectedElements.every((el) => p.elements.includes(el))
      );
    }

    // 3) forms
    if (fStore.selectedForms.length > 0) {
      result = result.filter((p) => fStore.selectedForms.includes(p.form));
    }

    // 3.1) region
    if (fStore.selectedRegions.length > 0) {
      result = result.filter((p) =>
        fStore.selectedRegions.includes(p.extra.region)
      );
    }

    // 4) classes
    if (fStore.selectedClasses.length > 0) {
      result = result.filter((p) => {
        const pClasses = p.info.class.split(',').map((c) => c.trim());
        return fStore.selectedClasses.every((cls) => pClasses.includes(cls));
      });
    }

    // 5) tiers
    if (fStore.selectedTiers.length > 0) {
      result = result.filter((p) => fStore.selectedTiers.includes(p.info.tier));
    }

    // 6) level
    result = result.filter((p) => {
      const lvl = Number(p.info.level) || 0;
      return lvl >= fStore.minLevel && lvl <= fStore.maxLevel;
    });

    // 7) xp_caught
    result = result.filter((p) => {
      const xp = Number(p.extra.xp_caught) || 0;
      return xp >= fStore.minXp && xp <= fStore.maxXp;
    });

    // 8) npc_price
    result = result.filter((p) => {
      const price = Number(p.extra.npc_price) || 0;
      return price >= fStore.minNpcPrice && price <= fStore.maxNpcPrice;
    });

    // 9) difficulty
    if (fStore.selectedDifficulties.length > 0) {
      result = result.filter((p) =>
        fStore.selectedDifficulties.includes(p.extra.difficulty)
      );
    }

    // 10) mediaCatch
    result = result.filter((p) => {
      const {
        table_pb: pb,
        table_gb: gb,
        table_sb: sb,
        table_ub: ub,
        table_be1: be1,
        table_be2: be2,
        table_be3: be3,
        table_be4: be4,
        table_sfb: sfb,
      } = p.tables;
      const ranges = fStore.mediaCatch;
      if (pb < 0 || pb > ranges.pb[1]) return false;
      if (gb < 0 || gb > ranges.gb[1]) return false;
      if (sb < 0 || sb > ranges.sb[1]) return false;
      if (ub < 0 || ub > ranges.ub[1]) return false;
      if (be1 < 0 || be1 > ranges.be1[1]) return false;
      if (be2 < 0 || be2 > ranges.be2[1]) return false;
      if (be3 < 0 || be3 > ranges.be3[1]) return false;
      if (be4 < 0 || be4 > ranges.be4[1]) return false;
      if (sfb < 0 || sfb > ranges.sfb[1]) return false;
      return true;
    });

    // 11) abilities
    if (fStore.selectedAbilities.length > 0) {
      result = result.filter((p) =>
        fStore.selectedAbilities.every((ab) => p.info.abilities.includes(ab))
      );
    }

    // 12) movesTerm
    if (fStore.movesTerm.trim() !== '') {
      const term = fStore.movesTerm.toLowerCase();
      result = result.filter((p) =>
        p.info.moves.some((m) => m.move.toLowerCase().includes(term))
      );
    }

    // 12.1) moves -> element
    if (fStore.selectedMoveElements.length > 0) {
      result = result.filter((p) =>
        p.info.moves.some((m) =>
          fStore.selectedMoveElements.includes(m.element || '')
        )
      );
    }

    // 12.2) moves -> type
    if (fStore.selectedMoveTypes.length > 0) {
      result = result.filter((p) =>
        p.info.moves.some((m) =>
          m.imagenes_accion.some((img) =>
            fStore.selectedMoveTypes.includes(img.alt)
          )
        )
      );
    }

    // 13) effectiveness
    for (const [cat, arrEls] of Object.entries(fStore.selectedEffectiveness)) {
      if (arrEls.length > 0) {
        result = result.filter((p) => {
          const effArray = p.info.effectiveness[cat] || [];
          return arrEls.every((el) => effArray.includes(el));
        });
      }
    }

    // 14) lootTerm
    if (fStore.lootTerm.trim() !== '') {
      const lTerm = fStore.lootTerm.toLowerCase();
      result = result.filter((p) =>
        p.info.loot.some((item) => {
          const itemName = (item[0] || '').toLowerCase();
          return itemName.includes(lTerm);
        })
      );
    }

    return result;
  }, [pokemons, fuse, fStore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loader mb-4">Cargando...</div>
          <p>Cargando pokemons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <FilterMenu />
      <div className="flex-1 p-4">
        <HeaderWithChips total={filteredPokemons.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderWithChips({ total }: { total: number }) {
  const fStore = useFilterStore();

  const chips: { label: string; onRemove: () => void }[] = [];

  // 1) name/number
  if (fStore.searchTerm) {
    chips.push({
      label: `Buscar: ${fStore.searchTerm}`,
      onRemove: () => fStore.setSearchTerm(''),
    });
  }

  // 2) elements
  fStore.selectedElements.forEach((el) => {
    chips.push({
      label: `Element: ${el}`,
      onRemove: () => fStore.toggleElement(el),
    });
  });

  // 3) forms
  fStore.selectedForms.forEach((frm) => {
    chips.push({
      label: `Form: ${frm}`,
      onRemove: () => fStore.toggleForm(frm),
    });
  });

  // 3.1) region
  fStore.selectedRegions.forEach((reg) => {
    chips.push({
      label: `Region: ${reg}`,
      onRemove: () => fStore.toggleRegion(reg),
    });
  });

  // 4) classes
  fStore.selectedClasses.forEach((cls) => {
    chips.push({
      label: `Class: ${cls}`,
      onRemove: () => fStore.toggleClass(cls),
    });
  });

  // 5) tiers
  fStore.selectedTiers.forEach((t) => {
    chips.push({
      label: `Tier: ${t}`,
      onRemove: () => fStore.toggleTier(t),
    });
  });

  // 6) level
  if (fStore.minLevel !== 1 || fStore.maxLevel !== 9999) {
    chips.push({
      label: `Level: ${fStore.minLevel}-${fStore.maxLevel}`,
      onRemove: () => {
        fStore.setMinLevel(1);
        fStore.setMaxLevel(9999);
      },
    });
  }

  // 7) xp
  if (fStore.minXp !== 0 || fStore.maxXp !== 9999999) {
    chips.push({
      label: `XP: ${fStore.minXp}-${fStore.maxXp}`,
      onRemove: () => {
        fStore.setMinXp(0);
        fStore.setMaxXp(9999999);
      },
    });
  }

  // 8) npc_price
  if (fStore.minNpcPrice !== 0 || fStore.maxNpcPrice !== 9999999) {
    chips.push({
      label: `NPC: ${fStore.minNpcPrice}-${fStore.maxNpcPrice}`,
      onRemove: () => {
        fStore.setMinNpcPrice(0);
        fStore.setMaxNpcPrice(9999999);
      },
    });
  }

  // 9) difficulty
  fStore.selectedDifficulties.forEach((diff) => {
    chips.push({
      label: `Difficulty: ${diff}`,
      onRemove: () => fStore.toggleDifficulty(diff),
    });
  });

  // 10) mediaCatch
  for (const [ball, [min, max]] of Object.entries(fStore.mediaCatch)) {
    if (max !== 999999) {
      chips.push({
        label: `Catch-${ball}: 0-${max}`,
        onRemove: () => fStore.setMediaCatchRange(ball as any, 0, 999999),
      });
    }
  }

  // 11) abilities
  fStore.selectedAbilities.forEach((ab) => {
    chips.push({
      label: `Ability: ${ab}`,
      onRemove: () => fStore.toggleAbility(ab),
    });
  });

  // 12) movesTerm
  if (fStore.movesTerm) {
    chips.push({
      label: `Move: ${fStore.movesTerm}`,
      onRemove: () => fStore.setMovesTerm(''),
    });
  }

  // 12.1) moves -> element
  fStore.selectedMoveElements.forEach((mel) => {
    chips.push({
      label: `MoveEl: ${mel}`,
      onRemove: () => fStore.toggleMoveElement(mel),
    });
  });

  // 12.2) moves -> type
  fStore.selectedMoveTypes.forEach((mt) => {
    chips.push({
      label: `MoveType: ${mt}`,
      onRemove: () => fStore.toggleMoveType(mt),
    });
  });

  // 13) effectiveness
  for (const [cat, arrEls] of Object.entries(fStore.selectedEffectiveness)) {
    arrEls.forEach((el) => {
      chips.push({
        label: `${cat}: ${el}`,
        onRemove: () => fStore.toggleEffectiveness(cat, el),
      });
    });
  }

  // 14) lootTerm
  if (fStore.lootTerm) {
    chips.push({
      label: `Loot: ${fStore.lootTerm}`,
      onRemove: () => fStore.setLootTerm(''),
    });
  }

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-2">Mostrando {total} Pokemons</h1>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <div
            key={i}
            className="flex items-center bg-gray-200 rounded px-2 py-1"
          >
            <span className="text-sm">{chip.label}</span>
            <button
              onClick={chip.onRemove}
              className="ml-2 text-red-600 font-bold text-sm"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

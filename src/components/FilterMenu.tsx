import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '../store/filterStore';

/** CollapsibleSection y SubCollapsible, etc. */

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  activeFiltersCount = 0,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  activeFiltersCount?: number;
}) {
  return (
    <div className="mb-2 border-b border-gray-300">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-2 text-left font-bold"
      >
        <span>{title}</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
            {activeFiltersCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubCollapsible({
  title,
  isOpen,
  onToggle,
  children,
  count = 0,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="ml-4 mt-2">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full font-semibold text-sm"
      >
        <span>{title}</span>
        {count > 0 && (
          <span className="bg-blue-400 text-white px-2 py-1 rounded text-xs">
            {count}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const elementImages: Record<string, string> = {
  Fire: 'https://wiki.pokexgames.com/images/3/30/Fire.png',
  Electric: 'https://wiki.pokexgames.com/images/2/2f/Electric.png',
  Ground: 'https://wiki.pokexgames.com/images/8/8f/Ground.png',
  Rock: 'https://wiki.pokexgames.com/images/0/0b/Rock.png',
  Grass: 'https://wiki.pokexgames.com/images/c/c5/Grass.png',
  Bug: 'https://wiki.pokexgames.com/images/7/7d/Bug.png',
  Steel: 'https://wiki.pokexgames.com/images/c/c9/Steel.png',
  Crystal: 'https://wiki.pokexgames.com/images/3/31/Crystal.png',
  Flying: 'https://wiki.pokexgames.com/images/7/7f/Flying.png',
  Dragon: 'https://wiki.pokexgames.com/images/c/c7/Dragon.png',
  Psychic: 'https://wiki.pokexgames.com/images/2/21/Psychic.png',
  Fairy: 'https://wiki.pokexgames.com/images/4/43/Fairy.png',
  Water: 'https://wiki.pokexgames.com/images/9/9d/Water.png',
  Ice: 'https://wiki.pokexgames.com/images/7/77/Ice.png',
  Ghost: 'https://wiki.pokexgames.com/images/5/59/Ghost1.png',
  Dark: 'https://wiki.pokexgames.com/images/9/98/Dark1.png',
  Poison: 'https://wiki.pokexgames.com/images/0/03/Poison1.png',
  Normal: 'https://wiki.pokexgames.com/images/e/e8/Normal1.png',
  Fighting: 'https://wiki.pokexgames.com/images/3/30/Fighting.png',
};

const classImages: Record<string, string> = {
  Volcanic: 'https://wiki.pokexgames.com/images/6/64/Volcanic1.png',
  Malefic: 'https://wiki.pokexgames.com/images/5/56/Malefi1c.png',
  Naturia: 'https://wiki.pokexgames.com/images/3/30/Naturia1.png',
  Psycraft: 'https://wiki.pokexgames.com/images/5/59/Psycraft1.png',
  Seavell: 'https://wiki.pokexgames.com/images/2/2c/Seave1ll.png',
  Ironhard: 'https://wiki.pokexgames.com/images/9/9a/Ironhard1.png',
  Raibolt: 'https://wiki.pokexgames.com/images/b/b4/Raibol1t.png',
  Wingeon: 'https://wiki.pokexgames.com/images/0/0c/Wingeon1.png',
  Orebound: 'https://wiki.pokexgames.com/images/e/e2/Orebound1.png',
  Gardestrike: 'https://wiki.pokexgames.com/images/3/39/Gardestrike1.png',
};

export default function FilterMenu() {
  const fStore = useFilterStore();

  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleSection = (sec: string) => {
    setOpenSection((prev) => (prev === sec ? null : sec));
  };

  const [openRegionSub, setOpenRegionSub] = useState(false);

  // Contadores
  const countElements = fStore.selectedElements.length;
  const countForms = fStore.selectedForms.length;
  const countClasses = fStore.selectedClasses.length;
  const countTiers = fStore.selectedTiers.length;
  const countLoot = fStore.lootTerm ? 1 : 0;
  const countLevel = (fStore.minLevel !== 1 || fStore.maxLevel !== 9999) ? 1 : 0;
  const countXp = (fStore.minXp !== 0 || fStore.maxXp !== 9999999) ? 1 : 0;
  const countNpc = (fStore.minNpcPrice !== 0 || fStore.maxNpcPrice !== 9999999) ? 1 : 0;
  const countDiff = fStore.selectedDifficulties.length;

  let countMediaCatch = 0;
  Object.values(fStore.mediaCatch).forEach(([min, max]) => {
    if (max !== 999999) countMediaCatch++;
  });

  const countAbilities = fStore.selectedAbilities.length;
  const countMovesTerm = fStore.movesTerm ? 1 : 0;
  const countMoveEls = fStore.selectedMoveElements.length;
  const countMoveTypes = fStore.selectedMoveTypes.length;

  let countEffect = 0;
  for (const arr of Object.values(fStore.selectedEffectiveness)) {
    countEffect += arr.length;
  }

  const countRegions = fStore.selectedRegions.length;

  return (
    <div className="sticky top-0 z-50 w-64 bg-white p-4 shadow-md h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Pokexgames - Dex</h1>
        <button
          onClick={() => fStore.toggleDarkMode()}
          className="filter-btn bg-gray-200 text-gray-800"
        >
          {fStore.darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 w-full"
          placeholder="Buscar por nombre/numero"
          value={fStore.searchTerm}
          onChange={(e) => fStore.setSearchTerm(e.target.value)}
        />
        <button
          onClick={fStore.clearAllFilters}
          className="btn-clear-filters mt-2"
        >
          Borrar todos los filtros
        </button>
      </div>

      <CollapsibleSection
        title="Elements"
        isOpen={openSection === "Elements"}
        onToggle={() => toggleSection("Elements")}
        activeFiltersCount={countElements}
      >
        <div className="flex flex-col gap-2">
          {Object.keys(elementImages).map((el) => (
            <label key={el} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedElements.includes(el)}
                onChange={() => fStore.toggleElement(el)}
              />
              <img src={elementImages[el]} alt={el} className="w-5 h-5" />
              <span>{el}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearElements}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Elements
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Form"
        isOpen={openSection === "Form"}
        onToggle={() => toggleSection("Form")}
        activeFiltersCount={countForms + countRegions}
      >
        <div className="flex flex-col gap-2">
          {["Normal", "Shiny", "Mega", "TM", "Otro"].map((frm) => (
            <label key={frm} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedForms.includes(frm)}
                onChange={() => fStore.toggleForm(frm)}
              />
              <span>{frm}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearForms}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Forms
          </button>

          <SubCollapsible
            title="Region"
            isOpen={openRegionSub}
            onToggle={() => setOpenRegionSub((prev) => !prev)}
            count={countRegions}
          >
            <div className="flex flex-col gap-2">
              {[
                "Kanto",
                "Johto",
                "Hoenn",
                "Sinnoh",
                "Unova",
                "Kalos",
                "Alola",
                "Galar",
                "Paldea",
              ].map((reg) => (
                <label key={reg} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fStore.selectedRegions.includes(reg)}
                    onChange={() => fStore.toggleRegion(reg)}
                  />
                  <span>{reg}</span>
                </label>
              ))}
              <button
                onClick={fStore.clearRegions}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Limpiar Regions
              </button>
            </div>
          </SubCollapsible>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Class"
        isOpen={openSection === "Class"}
        onToggle={() => toggleSection("Class")}
        activeFiltersCount={countClasses}
      >
        <div className="flex flex-col gap-2">
          {Object.keys(classImages).map((cls) => (
            <label key={cls} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedClasses.includes(cls)}
                onChange={() => fStore.toggleClass(cls)}
              />
              <img src={classImages[cls]} alt={cls} className="w-5 h-5" />
              <span>{cls}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearClasses}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Class
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Tier"
        isOpen={openSection === "Tier"}
        onToggle={() => toggleSection("Tier")}
        activeFiltersCount={countTiers}
      >
        <div className="flex flex-col gap-2">
          {["Tier 1A", "Tier 1B", "Tier 1C", "Tier 1H", "Tier 2", "Tier 3"].map((tier) => (
            <label key={tier} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedTiers.includes(tier)}
                onChange={() => fStore.toggleTier(tier)}
              />
              <span>{tier}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearTiers}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Tier
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Loot (Autocomplete)"
        isOpen={openSection === "LootTerm"}
        onToggle={() => toggleSection("LootTerm")}
        activeFiltersCount={countLoot}
      >
        <input
          type="text"
          className="border border-gray-300 p-2 w-full"
          placeholder="Ej: Bottle Of Poison"
          value={fStore.lootTerm}
          onChange={(e) => fStore.setLootTerm(e.target.value)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Level"
        isOpen={openSection === "Level"}
        onToggle={() => toggleSection("Level")}
        activeFiltersCount={countLevel}
      >
        <div className="flex flex-col gap-2">
          <label>
            Min Level:
            <input
              type="number"
              className="border ml-2 p-1"
              value={fStore.minLevel}
              onChange={(e) => fStore.setMinLevel(Number(e.target.value))}
            />
          </label>
          <label>
            Max Level:
            <input
              type="number"
              className="border ml-2 p-1"
              value={fStore.maxLevel}
              onChange={(e) => fStore.setMaxLevel(Number(e.target.value))}
            />
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="XP Caught"
        isOpen={openSection === "XpCaught"}
        onToggle={() => toggleSection("XpCaught")}
        activeFiltersCount={countXp}
      >
        <div className="flex flex-col gap-2">
          <label>
            Min XP:
            <input
              type="number"
              className="border ml-2 p-1"
              value={fStore.minXp}
              onChange={(e) => fStore.setMinXp(Number(e.target.value))}
            />
          </label>
          <label>
            Max XP:
            <input
              type="number"
              className="border ml-2 p-1"
              value={fStore.maxXp}
              onChange={(e) => fStore.setMaxXp(Number(e.target.value))}
            />
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="NPC Price"
        isOpen={openSection === "NpcPrice"}
        onToggle={() => toggleSection("NpcPrice")}
        activeFiltersCount={countNpc}
      >
        <div className="flex flex-col gap-2">
          <label>
            Min Price:
            <input
              type="number"
              className="border ml-2 p-1"
              value={fStore.minNpcPrice}
              onChange={(e) => fStore.setMinNpcPrice(Number(e.target.value))}
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              className="border ml-2 p-1"
              value={fStore.maxNpcPrice}
              onChange={(e) => fStore.setMaxNpcPrice(Number(e.target.value))}
            />
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Difficulty"
        isOpen={openSection === "Difficulty"}
        onToggle={() => toggleSection("Difficulty")}
        activeFiltersCount={countDiff}
      >
        <div className="flex flex-col gap-2">
          {["Fácil", "Médio", "Difícil"].map((diff) => (
            <label key={diff} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedDifficulties.includes(diff)}
                onChange={() => fStore.toggleDifficulty(diff)}
              />
              <span>{diff}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearDifficulties}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Difficulty
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Media Catch"
        isOpen={openSection === "MediaCatch"}
        onToggle={() => toggleSection("MediaCatch")}
        activeFiltersCount={countMediaCatch}
      >
        {([
          { key: "pb", label: "Pokebola", img: "https://media-pxg.vercel.app/images/balls/pokeball.png" },
          { key: "gb", label: "Great Ball", img: "https://media-pxg.vercel.app/images/balls/greatball.png" },
          { key: "sb", label: "Super Ball", img: "https://media-pxg.vercel.app/images/balls/superball.png" },
          { key: "ub", label: "Ultra Ball", img: "https://media-pxg.vercel.app/images/balls/ultraball.png" },
          { key: "be1", label: "Beast Ball 1", img: "https://media-pxg.vercel.app/images/balls/yumeball.png" },
          { key: "be2", label: "Beast Ball 2", img: "https://media-pxg.vercel.app/images/balls/soraball.png" },
          { key: "be3", label: "Beast Ball 3", img: "https://media-pxg.vercel.app/images/balls/tinkerball.png" },
          { key: "be4", label: "Beast Ball 4", img: "https://media-pxg.vercel.app/images/balls/maguball.png" },
          { key: "sfb", label: "Saffari Ball", img: "https://media-pxg.vercel.app/images/balls/saffariball.png" },
        ] as const).map((ball) => {
          const [, maxVal] = fStore.mediaCatch[ball.key];
          return (
            <div key={ball.key} className="mb-2">
              <div className="flex items-center gap-2">
                <img src={ball.img} alt={ball.label} className="w-6 h-6" />
                <span className="font-bold">{ball.label}</span>
              </div>
              <div className="ml-6 mt-1">
                <label>
                  Max:
                  <input
                    type="number"
                    className="border ml-1 p-1 w-16"
                    value={maxVal}
                    onChange={(e) =>
                      fStore.setMediaCatchRange(ball.key, 0, Number(e.target.value))
                    }
                  />
                </label>
              </div>
            </div>
          );
        })}
      </CollapsibleSection>

      <CollapsibleSection
        title="Abilities"
        isOpen={openSection === "Abilities"}
        onToggle={() => toggleSection("Abilities")}
        activeFiltersCount={countAbilities}
      >
        <div className="flex flex-col gap-2">
          {[
            "Fly",
            "Teleport",
            "Blink",
            "Surf",
            "Ride",
            "Dig",
            "Cut",
            "Transform",
            "Light",
            "Headbutt",
            "Levitate",
            "Rock Smash",
            "Control Minds",
            "Dark Portal",
          ].map((ab) => (
            <label key={ab} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedAbilities.includes(ab)}
                onChange={() => fStore.toggleAbility(ab)}
              />
              <span>{ab}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearAbilities}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Abilities
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Moves (Autocomplete)"
        isOpen={openSection === "MovesTerm"}
        onToggle={() => toggleSection("MovesTerm")}
        activeFiltersCount={countMovesTerm}
      >
        <input
          type="text"
          className="border border-gray-300 p-2 w-full"
          placeholder="Ej: Flamethrower"
          value={fStore.movesTerm}
          onChange={(e) => fStore.setMovesTerm(e.target.value)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Moves -> Element"
        isOpen={openSection === "MoveElements"}
        onToggle={() => toggleSection("MoveElements")}
        activeFiltersCount={countMoveEls}
      >
        <div className="flex flex-col gap-2">
          {Object.keys(elementImages).map((el) => (
            <label key={el} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedMoveElements.includes(el)}
                onChange={() => fStore.toggleMoveElement(el)}
              />
              <img src={elementImages[el]} alt={el} className="w-5 h-5" />
              <span>{el}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearMoveElements}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Move Elements
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Moves -> Type"
        isOpen={openSection === "MoveTypes"}
        onToggle={() => toggleSection("MoveTypes")}
        activeFiltersCount={countMoveTypes}
      >
        <div className="flex flex-col gap-2">
          {[
            "AOE",
            "Blind",
            "Buff",
            "Burn",
            "Confusion",
            "Damage",
            "Debuff",
            "Healing",
            "Knockback",
            "Lifesteal",
            "Locked",
            "Neverboost",
            "Nevermiss",
            "Paralyze",
            "Passive",
            "Poison",
            "Self",
            "Silence",
            "Slow",
            "Stuck",
            "Stun",
            "Target",
          ].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fStore.selectedMoveTypes.includes(t)}
                onChange={() => fStore.toggleMoveType(t)}
              />
              <span>{t}</span>
            </label>
          ))}
          <button
            onClick={fStore.clearMoveTypes}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Limpiar Move Types
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Effectiveness"
        isOpen={openSection === "Effectiveness"}
        onToggle={() => toggleSection("Effectiveness")}
        activeFiltersCount={countEffect}
      >
        {Object.entries(fStore.selectedEffectiveness).map(([category, arr]) => (
          <div key={category} className="border p-2 mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{category}</span>
              <button
                onClick={() => fStore.clearEffectivenessCategory(category)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Limpiar {category}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.keys(elementImages).map((el) => (
                <label key={el} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={arr.includes(el)}
                    onChange={() => fStore.toggleEffectiveness(category, el)}
                  />
                  <img src={elementImages[el]} alt={el} className="w-5 h-5" />
                  <span>{el}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </CollapsibleSection>
    </div>
  );
}

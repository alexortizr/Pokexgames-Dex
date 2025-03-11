import { motion } from "framer-motion";
import { Pokemon } from "../types";
import { useState } from "react";
import PokemonModal from "./PokemonModal";

const elementColors: Record<string, string> = {
  Electric: "#FFF3A5",
  Ground: "#E0C4A0",
  Rock: "#D1C6B8",
  Grass: "#B8E0B8",
  Bug: "#C8E4C8",
  Steel: "#B0C4DE",
  Crystal: "#D4F1F9",
  Flying: "#A8D8F0",
  Dragon: "#D8BFD8",
  Psychic: "#FFB5E8",
  Fairy: "#FFD1DC",
  Water: "#9AD3DE",
  Ice: "#C2F3F3",
  Ghost: "#D3B8E6",
  Dark: "#B19FB9",
  Poison: "#D8AED8",
  Normal: "#E5E5E5",
  Fighting: "#FFA7A7",
  Fire: "#FFAB8F",
};

const elementImages: Record<string, string> = {
  Electric: "https://wiki.pokexgames.com/images/2/2f/Electric.png",
  Ground: "https://wiki.pokexgames.com/images/8/8f/Ground.png",
  Rock: "https://wiki.pokexgames.com/images/0/0b/Rock.png",
  Grass: "https://wiki.pokexgames.com/images/c/c5/Grass.png",
  Bug: "https://wiki.pokexgames.com/images/7/7d/Bug.png",
  Steel: "https://wiki.pokexgames.com/images/c/c9/Steel.png",
  Crystal: "https://wiki.pokexgames.com/images/3/31/Crystal.png",
  Flying: "https://wiki.pokexgames.com/images/7/7f/Flying.png",
  Dragon: "https://wiki.pokexgames.com/images/c/c7/Dragon.png",
  Psychic: "https://wiki.pokexgames.com/images/2/21/Psychic.png",
  Fairy: "https://wiki.pokexgames.com/images/4/43/Fairy.png",
  Water: "https://wiki.pokexgames.com/images/9/9d/Water.png",
  Ice: "https://wiki.pokexgames.com/images/7/77/Ice.png",
  Ghost: "https://wiki.pokexgames.com/images/5/59/Ghost1.png",
  Dark: "https://wiki.pokexgames.com/images/9/98/Dark1.png",
  Poison: "https://wiki.pokexgames.com/images/0/03/Poison1.png",
  Normal: "https://wiki.pokexgames.com/images/e/e8/Normal1.png",
  Fighting: "https://wiki.pokexgames.com/images/3/30/Fighting.png",
  Fire: "https://wiki.pokexgames.com/images/3/30/Fire.png",
};

function getElementGradient(elements: string[]): string {
  if (elements.length === 0) return "#FFFFFF";
  if (elements.length === 1) return elementColors[elements[0]] || "#FFFFFF";
  if (elements.length === 2) {
    const c1 = elementColors[elements[0]] || "#fff";
    const c2 = elementColors[elements[1]] || "#fff";
    return `linear-gradient(45deg, ${c1}, ${c2})`;
  }
  const stops = elements.map((el, idx) => {
    const color = elementColors[el] || "#fff";
    const pct = Math.floor((idx / (elements.length - 1)) * 100);
    return `${color} ${pct}%`;
  });
  return `linear-gradient(45deg, ${stops.join(", ")})`;
}

function getFormBorderClass(form: string): string {
  switch (form.toLowerCase()) {
    case "shiny":
      return "borde-shiny";
    case "mega":
      return "borde-mega";
    case "alolan":
      return "borde-alolan";
    case "galarian":
      return "borde-galarian";
    case "tm":
      return "borde-tm";
    case "otro":
      return "borde-otro";
    default:
      return "borde-normal";
  }
}

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const bgGradient = getElementGradient(pokemon.elements);
  const formBorderClass = getFormBorderClass(pokemon.form);

  const cardClasses = `card-hover ${formBorderClass} p-2 rounded shadow-md cursor-pointer`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardClasses}
        style={{ background: bgGradient }}
        onClick={handleClick}
      >
        {/* Número */}
        <div className="relative">
          <div className="absolute top-2 left-2 text-gray-500 font-bold text-sm">
            #{pokemon.number}
          </div>

          {/* Imagen */}
          <div className="flex justify-center items-center h-32">
            <img
              src={pokemon.info.pokemon_image}
              alt={pokemon.name}
              className="h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Nombre */}
        <h2 className="text-center font-bold text-lg mt-2">{pokemon.name}</h2>

        {/* Elementos */}
        <div className="flex justify-center gap-1 mt-2">
          {pokemon.elements.map((el) => {
            const icon = elementImages[el];
            return (
              <img
                key={el}
                src={icon}
                alt={el}
                className="w-6 h-6 object-contain"
                title={el}
              />
            );
          })}
        </div>
      </motion.div>

      {showModal && (
        <PokemonModal pokemon={pokemon} onClose={handleClose} />
      )}
    </>
  );
}

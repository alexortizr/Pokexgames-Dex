import { Pokemon } from "../types";
import { motion } from "framer-motion";
import React, { useState } from "react";

const ORIGINAL_WIDTH = 911;
const ORIGINAL_HEIGHT = 1600;

const miniSize = 200;
const fullWidth = 600;
const fullHeight = Math.round((fullWidth / ORIGINAL_WIDTH) * ORIGINAL_HEIGHT);

const MAP_IMAGE_URL = "https://media-pxg.vercel.app/_next/static/media/mapa-pxg.9347fc0d.jpg";
const PIN_ICON = "https://static-00.iconduck.com/assets.00/location-pin-icon-385x512-cgns0aw7.png";

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

interface MapMarker {
  top: number;
  left: number;
  text: string;
}

function parseMapsData(mapsStr: string): MapMarker[] {
  const markers: MapMarker[] = [];
  const parts = mapsStr.split(";").map(p => p.trim()).filter(Boolean);
  parts.forEach((part) => {
    const topMatch = part.match(/"top"\s*:\s*(\d+)/);
    const leftMatch = part.match(/"left"\s*:\s*(\d+)/);
    const textMatch = part.match(/"text"\s*:\s*"([^"]+)"/);
    if (topMatch && leftMatch && textMatch) {
      markers.push({
        top: parseInt(topMatch[1], 10),
        left: parseInt(leftMatch[1], 10),
        text: textMatch[1],
      });
    }
  });
  return markers;
}

function calcBackgroundOffsets(marker: MapMarker, contW: number, contH: number) {
  const pointX = (marker.left / 100) * ORIGINAL_WIDTH;
  const pointY = (marker.top / 100) * ORIGINAL_HEIGHT;
  const offsetX = contW / 2 - pointX;
  const offsetY = contH / 2 - pointY;
  return { offsetX, offsetY };
}

function MiniMapPoint({ marker }: { marker: MapMarker }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  if (!expanded) {
    // minimapa circular
    const { offsetX, offsetY } = calcBackgroundOffsets(marker, miniSize, miniSize);
    return (
      <div className="mb-4">
        <div
          className="relative border rounded-full overflow-hidden"
          style={{
            width: `${miniSize}px`,
            height: `${miniSize}px`,
            backgroundImage: `url(${MAP_IMAGE_URL})`,
            backgroundSize: `${ORIGINAL_WIDTH}px ${ORIGINAL_HEIGHT}px`,
            backgroundPosition: `${offsetX}px ${offsetY}px`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img src={PIN_ICON} alt="pin" className="w-5 h-8" />
            <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded mt-1 text-center">
              {marker.text}
            </div>
          </div>
        </div>
        <button
          onClick={toggleExpanded}
          className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
        >
          Ampliar mapa
        </button>
      </div>
    );
  } else {
    // modo ampliado
    const { offsetX, offsetY } = calcBackgroundOffsets(marker, fullWidth, fullHeight);
    return (
      <div className="mb-4">
        <div
          className="relative border overflow-hidden"
          style={{
            width: `${fullWidth}px`,
            height: `${fullHeight}px`,
            backgroundImage: `url(${MAP_IMAGE_URL})`,
            backgroundSize: `${ORIGINAL_WIDTH}px ${ORIGINAL_HEIGHT}px`,
            backgroundPosition: `${offsetX}px ${offsetY}px`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img src={PIN_ICON} alt="pin" className="w-5 h-8" />
            <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded mt-1 text-center">
              {marker.text}
            </div>
          </div>
        </div>
        <button
          onClick={toggleExpanded}
          className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
        >
          Reducir mapa
        </button>
      </div>
    );
  }
}

export default function PokemonModal({
  pokemon,
  onClose,
}: {
  pokemon: Pokemon;
  onClose: () => void;
}) {
  const markers = pokemon.extra.maps?.trim() ? parseMapsData(pokemon.extra.maps) : [];
  const bgGradient = getElementGradient(pokemon.elements);
  const formBorderClass = getFormBorderClass(pokemon.form);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`p-4 rounded-md w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto ${formBorderClass}`}
        style={{ background: bgGradient }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="bg-red-500 text-white px-2 py-1 rounded mb-2"
          onClick={onClose}
        >
          Cerrar
        </button>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <img
              src={pokemon.info.pokemon_image}
              alt={pokemon.name}
              className="w-48 h-48 object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">{pokemon.name}</h2>
            <p className="text-gray-600 mb-2">{pokemon.info.description}</p>
            <p><strong>Level:</strong> {pokemon.info.level}</p>
            <p><strong>Class:</strong> {pokemon.info.class}</p>
            <p><strong>Región:</strong> {pokemon.extra.region}</p>
            <p><strong>Dificultad:</strong> {pokemon.extra.difficulty}</p>
            <p><strong>XP al atrapar:</strong> {pokemon.extra.xp_caught}</p>
            <p><strong>Precio NPC:</strong> {pokemon.extra.npc_price}</p>

            {/* Ubicaciones en el mapa */}
            {markers.length > 0 && (
              <div>
                <h3 className="font-bold mt-4">Ubicaciones en el mapa:</h3>
                <div className="grid grid-cols-1 gap-4">
                  {markers.map((marker, idx) => (
                    <MiniMapPoint key={idx} marker={marker} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg">Movimientos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pokemon.info.moves.map((move) => (
              <div key={move.slot} className="border p-2 rounded flex flex-col gap-1">
                <span className="font-bold">{move.move}</span>
                <span>Cooldown: {move.cooldown}</span>
                <div className="flex gap-1">
                  {move.imagenes_accion.map((img, i) => (
                    <img key={i} src={img.src} alt={img.alt} title={img.title} className="w-6 h-6" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg">Loot</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.info.loot.map((item, idx) => {
              const [itemName, itemUrl, itemImg] = item;
              return (
                <a
                  key={idx}
                  href={itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border p-2 rounded"
                >
                  <img src={itemImg} alt={itemName} className="w-6 h-6" />
                  <span>{itemName}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg">Tablas de captura</h3>
          <p>Poké Ball: {pokemon.tables.table_pb}</p>
          <p>Great Ball: {pokemon.tables.table_gb}</p>
          <p>Super Ball: {pokemon.tables.table_sb}</p>
          <p>Ultra Ball: {pokemon.tables.table_ub}</p>
          <p>Beast Ball 1: {pokemon.tables.table_be1}</p>
          <p>Beast Ball 2: {pokemon.tables.table_be2}</p>
          <p>Beast Ball 3: {pokemon.tables.table_be3}</p>
          <p>Beast Ball 4: {pokemon.tables.table_be4}</p>
          <p>Saffari Ball: {pokemon.tables.table_sfb}</p>
        </div>
      </motion.div>
    </div>
  );
}

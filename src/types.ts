/**
 * Definimos EfficacyMap con firma de índice para evitar el error al indexar con 'cat'.
 */
export interface EfficacyMap {
  Efectivo?: string[];
  "Muy efectivo"?: string[];
  Normal?: string[];
  Inefectivo?: string[];
  "Muy Inefectivo"?: string[];
  Inmune?: string[];

  [key: string]: string[] | undefined; 
}

export interface Pokemon {
  id: number;
  number: string;
  name: string;
  form: string;
  elements: string[];
  info: {
    in_pokexgames: string;
    class: string;
    pokemon_image: string;
    class_image: string;
    pokemon_page: string;
    description: string;
    level: number | string;
    abilities: string[];
    boost: string;
    materia: string;
    evolution_stone: string;
    evolutions: string;
    moves: Array<{
      slot: string;
      move: string;
      cooldown: string;
      imagenes_accion: Array<{
        src: string;
        alt: string;
        title?: string;
      }>;
      element: string;
      imagen_elemento: {
        src: string;
        alt: string;
        title: string;
      };
      level: string;
    }>;
    effectiveness: EfficacyMap;
    other_versions: Array<{ imagen: string; name: string }>;
    tier: string;
    loot: Array<string[]>;
  };
  extra: {
    region: string;
    generation: string;
    difficulty: string;
    xp_caught: string;
    npc_price: string;
    maps: string;
  };
  tables: {
    table_pb: number;
    table_gb: number;
    table_sb: number;
    table_ub: number;
    table_be1: number;
    table_be2: number;
    table_be3: number;
    table_be4: number;
    table_sfb: number;
  };
}

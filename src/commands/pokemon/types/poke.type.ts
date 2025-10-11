// types/pokemon.type.ts

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default?: string;
  front_shiny?: string;
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
    dream_world?: {
      front_default?: string;
    };
  };
}

export interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[];
  color?: {
    name: string;
    url: string;
  };
  habitat?: {
    name: string;
    url: string;
  };
}

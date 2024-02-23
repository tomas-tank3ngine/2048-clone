export type Tile = {
  id?: string;
  position: [number, number];
  value: number;
};

//Tilemap is an object
//that must contain an array of tiles
//And accepts an string arg (id)
export type TileMap = { [id: string]: Tile };

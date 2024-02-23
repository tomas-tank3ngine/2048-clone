//reducer is a function that takes 2 args, the current state and an action.
//action will be used to compute a new state from the given state.
//actions are instructions that tell state to change in a given way.
import { isNil, flattenDeep } from "lodash";
import { Tile, TileMap } from "@/models/tile";
import { uid } from "uid";
import { tileCountPerDimension } from "@/constants";

//this is an array of many arrays of strings
type State = { board: string[][]; tiles: TileMap };
type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "move_up" }
  | { type: "move_down" }
  | { type: "move_left" }
  | { type: "move_right" }
  | { type: "clean_up" };

function createBoard() {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimension; i++) {
    //fill each row, 1-by-1, with x undefined tiles.
    board[i] = new Array(tileCountPerDimension).fill(undefined);
  }
  return board;
}

export const initialState: State = { board: createBoard(), tiles: {} }; //Need to export so that the default export can leave the component

export default function gameReducer(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case "clean_up": {
      const flattenBoard = flattenDeep(state.board);
      const newTiles: TileMap = flattenBoard.reduce(
        (result, tileId: string) => {
          //check if the current cell has a tile id
          if (isNil(tileId)) {
            return result;
          }

          return {
            ...result,
            [tileId]: state.tiles[tileId],
          };
        },
        {},
      );

      //replace state with updated tiles hashmap
      return {
        ...state,
        tiles: newTiles,
      };
    }

    case "create_tile": {
      const tileId = uid();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[y][x] = tileId;

      return {
        ...state,
        board: newBoard,
        tiles: {
          ...state.tiles,
          [tileId]: { id: tileId, ...action.tile },
        },
      };
    }

    case "move_up": {
      //iterate through board state and scan all x and y arrays
      //update the position of each tile up to the first free cell starting from the top of the column.

      const newBoard = createBoard(); //4x4 grid (nested array [][])
      const newTiles: TileMap = {}; //empty tilemap see tile.ts in models

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = 0; //cell at the top of the board has index 0
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          //check for a tile
          if (!isNil(tileId)) {
            //Stacking tiles
            //since we are checking from the direction we are stacking towards (swiping up - start check from top)
            //the previous tile will be above the current tile

            if (previousTile?.value === currentTile.value) {
              //merging tiles
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1], //-1 because we are stacking moving up
              };
              previousTile = undefined; //remove prev tile
              continue; //continue within the switch statement
            }

            //Using a temporary newBoard, notify that there is a tile at this location and pass that tile
            newBoard[newY][x] = tileId;
            //add the current tile to the newTiles, but give it the new position (moved all the way up)
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId]; //make sure we update the 'previous tile' with the new tile
            newY++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_down": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = tileCountPerDimension - 1;
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            newY--;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_left": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = 0;
        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [newX - 1, y],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            newX++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_right": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = tileCountPerDimension - 1;
        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };
              previousTile = undefined;
              continue;
            }
            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            newX--;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    default:
      return state;
  }
}

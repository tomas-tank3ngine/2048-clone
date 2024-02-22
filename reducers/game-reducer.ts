//reducer is a function that takes 2 args, the current state and an action.
//action will be used to compute a new state from the given state.
//actions are instructions that tell state to change in a given way.
import { isNil } from "lodash";
import { Tile, TileMap } from "@/models/tile";
import { uid } from "uid";
import { tileCountPerDimension } from "@/constants";

//this is an array of many arrays of strings
type State = { board: string[][]; tiles: TileMap };
type Action = { type: "create_tile"; tile: Tile } | { type: "move_up"};

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
    case "create_tile":
      {
        const tileId = uid();
        const [x, y] = action.tile.position;
        const newBoard = JSON.parse(JSON.stringify(state.board));
        newBoard[y][x] = tileId;

        return {
          ...state,
          board: newBoard,
          tiles: {
            ...state.tiles,
            [tileId]: action.tile,
          },
        };
      }

      case "move_up": {
        //iterate through board state and scan all x and y arrays, then update the position
        //of each tile up to the first free cell starting from the top of the column.

        const newBoard = createBoard();
        const newTiles: TileMap = {}

        for (let x = 0; x < tileCountPerDimension; x++) {
          let newY = 0; //cell at the top of the board has index 0

          for (let y = 0; y < tileCountPerDimension; y++) {
            const tileId = state.board[y][x]

            if(!isNil(tileId)) {
              newBoard[newY][x] = tileId
              newTiles[tileId] = {
                ...state.tiles[tileId],
                position: [x, newY],
              }
              newY++
            }
          }
        }

        return {
          ...state,
          board: newBoard,
          tiles: newTiles,
        }
      }

    default:
      return state;
  }
}

//reducer is a function that takes 2 args, the current state and an action.
//action will be used to compute a new state from the given state.
//actions are instructions that tell state to change in a given way.

import { Tile } from "@/models/tile";
import { uid } from "uid";

//this is an array of many arrays of strings
type State = { board: string[][]; tiles: { [id: string]: Tile } };
type Action = { type: "create_tile"; tile: Tile };

function createBoard(tileCountPerDimension: number = 4) {
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

      break;

    default:
      return state;
  }
}

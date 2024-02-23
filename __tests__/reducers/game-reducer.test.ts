import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { act, renderHook } from "@testing-library/react";
import { isNil } from "lodash";
import { useReducer } from "react";

describe("gameReducer", () => {

  describe("clean_up", ()=>{
    it("should remove tiles that are not referenced on the board state", ()=>{
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
        dispatch({ type: "move_up" })
      });

      const [stateBefore] = result.current;
      expect(Object.values(stateBefore.tiles)).toHaveLength(2)

      act(() => dispatch({ type: "clean_up"}))

      const [stateAfter] = result.current;
      expect(Object.values(stateAfter.tiles)).toHaveLength(1)
    })
  })

  describe("create_tile", () => {
    it("should create a new tile", () => {
      const tile: Tile = {
        position: [0, 0],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => dispatch({ type: "create_tile", tile }));

      const [state] = result.current;

      expect(state.board[0][0]).toBeDefined();
      expect(Object.values(state.tiles)).toEqual([tile]);
    });
  });

  //test vertical movement
  describe("move_down", () => {
    it("should move tiles to the bottom of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      // x and y positions are reversed: y comes first, then x (due to the nested array)
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(typeof stateAfter.board[3][1]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy(); //Checking that the starting position of the tiles is empty bc tiels have moved
    });

    it("should stack tiles with the same value on top each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [0, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;

      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[3][0]).toBe("string");

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(isNil(stateAfter.board[0][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(typeof stateAfter.board[3][0]).toBe("string");
    });
  });

  describe("move_up", () => {
    it("should move tiles to the top of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      // x and y positions are reversed: y comes first, then x (due to the nested array)
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[0][0]).toBe("string");
      expect(typeof stateAfter.board[0][1]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy(); //Checking that the starting position of the tiles is empty bc tiels have moved
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same value on top each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [0, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;

      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[3][0]).toBe("string");

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[0][0]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy(); //Checking that the starting position of the tiles is empty bc tiels have moved
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
    });
  });

  //Horizontal movement tests
  describe("move_left", () => {
    it("should move tiles to the left side of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      // x and y positions are reversed: y comes first, then x (due to the nested array)
      expect(isNil(stateBefore.board[3][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same values on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [3, 1],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[1][1])).toBeTruthy();
      expect(isNil(stateBefore.board[1][2])).toBeTruthy();
      expect(typeof stateBefore.board[1][3]).toBe("string");

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(isNil(stateAfter.board[1][1])).toBeTruthy();
      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(isNil(stateAfter.board[1][3])).toBeTruthy();
    });
  });

  describe("move_right", () => {
    it("should move tiles to the right side of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      // x and y positions are reversed: y comes first, then x (due to the nested array)
      expect(isNil(stateBefore.board[1][3])).toBeTruthy();
      expect(isNil(stateBefore.board[3][3])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_right" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][3]).toBe("string");
      expect(typeof stateAfter.board[3][3]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy(); //Checking that the starting position of the tiles is empty bc tiels have moved
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same values on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };
      const tile2: Tile = {
        position: [3, 1],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current; //extract dispatch (action) - disregarding the first value which is state

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[1][1])).toBeTruthy();
      expect(isNil(stateBefore.board[1][2])).toBeTruthy();
      expect(typeof stateBefore.board[1][3]).toBe("string");

      act(() => dispatch({ type: "move_right" }));

      const [stateAfter] = result.current;
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][1])).toBeTruthy();
      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(typeof stateAfter.board[1][3]).toBe("string");
    });
  });
});

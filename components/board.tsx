import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { useEffect, useReducer, useRef } from "react";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { Tile as TileModel } from "@//models/tile";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const initialized = useRef(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowUp":
        dispatch({ type: "move_up" });
        break;

      case "ArrowDown":
        dispatch({ type: "move_down" });
        break;

      default:
        break;
    }
  };

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let i = 0; i < totalCellsCount; i += 1) {
      cells.push(<div className={styles.cell} key={i}></div>);
    }
    return cells;
  };

  const renderTiles = () => {
    return Object.values(gameState.tiles).map(
      (tile: TileModel, index: number) => {
        return <Tile key={`${index}`} {...tile} />; //spread the tile modal to the tile component
      },
    );
  };

  //Initialize board
  useEffect(() => {
    if (initialized.current === false) {
      dispatch({ type: "create_tile", tile: { position: [0, 2], value: 2 } });
      dispatch({ type: "create_tile", tile: { position: [0, 1], value: 2 } });
      initialized.current = true;
    }
  }, []);

  //key input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.board}>
      <div className={styles.tiles}>{renderTiles()}</div>
      <div className={styles.grid}>{renderGrid()}</div>
    </div>
  );
}

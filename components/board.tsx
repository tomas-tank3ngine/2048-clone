import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { useEffect, useRef, useContext, useCallback } from "react";
import { Tile as TileModel } from "@//models/tile";
import { mergeAnimationDuration } from "@/constants";
import { GameContext } from "@/context/game-context";

export default function Board() {
  const { appendRandomTile, gameState, dispatch } = useContext(GameContext)


  const initialized = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowUp":
        dispatch({ type: "move_up" });
        break;

      case "ArrowDown":
        dispatch({ type: "move_down" });
        break;

      case "ArrowLeft":
        dispatch({ type: "move_left" });
        break;

      case "ArrowRight":
        dispatch({ type: "move_right" });
        break;

      default:
        break;
    }

    setTimeout(() => {
      dispatch({ type: "clean_up" })
      appendRandomTile()
    }, mergeAnimationDuration);
  },[appendRandomTile, dispatch]);

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
  }, [dispatch]);

  //key input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.board}>
      <div className={styles.tiles}>{renderTiles()}</div>
      <div className={styles.grid}>{renderGrid()}</div>
    </div>
  );
}

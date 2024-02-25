import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { useEffect, useRef, useContext, useCallback } from "react";
import { Tile as TileModel } from "@//models/tile";
import { GameContext } from "@/context/game-context";
import MobileSwiper, { SwipeInput } from "./mobile-swiper";

export default function Board() {
  const { getTiles, moveTiles, startGame } = useContext(GameContext);

  const initialized = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowUp":
          moveTiles( "move_up" );
          break;

        case "ArrowDown":
          moveTiles( "move_down" );
          break;

        case "ArrowLeft":
          moveTiles( "move_left" );
          break;

        case "ArrowRight":
          moveTiles( "move_right" );
          break;

        default:
          break;
      }
    },
    [moveTiles],
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles( "move_right" );
        } else {
          moveTiles( "move_left" );
        }
      } else {
        if (deltaY > 0) {
          moveTiles( "move_down" );
        } else {
          moveTiles( "move_up" );
        }
      }
    },
    [moveTiles],
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let i = 0; i < totalCellsCount; i += 1) {
      cells.push(<div className={styles.cell} key={i}></div>);
    }
    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => (
      <Tile key={`${tile.id}`} {...tile} /> //spread the tile model to the tile component
    ));
  };

  //Initialize board
  useEffect(() => {
    if (initialized.current === false) {
      startGame();
      initialized.current = true;
    }
  }, [startGame]);

  //key input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div className={styles.board}>
        <div className={styles.tiles}>{renderTiles()}</div>
        <div className={styles.grid}>{renderGrid()}</div>
      </div>
    </MobileSwiper>
  );
}

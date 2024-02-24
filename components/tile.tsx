import {
  containerWidth,
  tileCountPerDimension,
  mergeAnimationDuration,
} from "@/constants";
import usePreviousProps from "@/hooks/use-previous-props";
import { Tile as TileProps } from "@/models/tile";
import styles from "@/styles/tile.module.css";
import { useState, useEffect } from "react";

export default function Tile({ position, value }: TileProps) {
  const [scale, setScale] = useState(1);
  const previousValue = usePreviousProps(value); //auto detects the type (value: number)
  const hasChanged = previousValue != value;

  const positionToPixels = (position: number) => {
    return (position / tileCountPerDimension) * containerWidth;
  };

  useEffect(() => {
    if (hasChanged) {
      setScale(1.1);
      setTimeout(() => setScale(1), mergeAnimationDuration);
    }
  }, [hasChanged]);

  const style = {
    left: positionToPixels(position[0]),
    top: positionToPixels(position[1]),
    transform: `scale(${scale})`,
    zIndex: value,
  };

  return (
    <div className={styles.tile} style={style}>
      {value}
    </div>
  );
}

import styles from "@/styles/board.module.css";

export default function Board() {
  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let i = 0; i < totalCellsCount; i += 1) {
      cells.push(<div className={styles.cell} key={i}></div>);
    }

    return cells;
  };

  return (
    <div className={styles.board}>
      <div className={styles.grid}>{renderGrid()}</div>
    </div>
  );
}

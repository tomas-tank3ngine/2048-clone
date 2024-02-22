import { render } from "@testing-library/react";
import Board from "@/components/board";

//'describe' func used to organize and group related tests
describe("Board", () => {
  it("should render board with 16 cells", () => {
    const { container } = render(<Board />);
    const cellElements = container.querySelectorAll(".cell"); //Queries all elements with the 'cell' class

    expect(cellElements.length).toEqual(16);
  });

  it("should render board with 2 tiles", () => {
    const { container } = render(<Board />);
    const tiles = container.querySelectorAll(".tile"); //Queries all elements with the 'cell' class

    expect(tiles.length).toEqual(2);
  });
});

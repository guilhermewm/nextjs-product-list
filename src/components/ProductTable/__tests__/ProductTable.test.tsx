import { render, screen, within } from "@testing-library/react";
import { Product, Property } from "../../../utils/utils.types";
import { ProductTable } from "../ProductTable";

const properties: Property[] = [
  { id: 0, name: "Product Name", type: "string" },
  { id: 1, name: "color", type: "string" },
  { id: 2, name: "weight (oz)", type: "number" },
];

const products: Product[] = [
  {
    id: 1,
    property_values: [
      { property_id: 0, value: "Headphones" },
      { property_id: 1, value: "black" },
      { property_id: 2, value: 5 },
    ],
  },
  {
    id: 2,
    property_values: [
      { property_id: 0, value: "Keyboard" },
      { property_id: 1, value: "grey" },
      { property_id: 2, value: 3 },
    ],
  },
];

describe("ProductTable", () => {
  test("renders product count header when products provided", () => {
    render(
      <ProductTable
        products={products}
        properties={properties}
        loading={false}
      />
    );
    expect(
      screen.getByText("Showing 2 products from the catalog")
    ).toBeInTheDocument();
  });

  test("renders all property columns", () => {
    render(
      <ProductTable
        products={products}
        properties={properties}
        loading={false}
      />
    );
    properties.forEach(prop => {
      expect(
        screen.getByRole("columnheader", { name: prop.name })
      ).toBeInTheDocument();
    });
  });

  test("maps product values into rows", () => {
    render(
      <ProductTable
        products={products}
        properties={properties}
        loading={false}
      />
    );
    expect(screen.getByText("Headphones")).toBeInTheDocument();
    expect(screen.getByText("black")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Keyboard")).toBeInTheDocument();
    expect(screen.getByText("grey")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("shows empty state", () => {
    render(
      <ProductTable products={[]} properties={properties} loading={false} />
    );
    const table = screen.getByRole("table");
    expect(
      within(table).getByText(/no data/i, { selector: "div" })
    ).toBeInTheDocument();
  });
});

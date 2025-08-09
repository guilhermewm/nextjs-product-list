import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Property } from "../../../utils/utils.types";
import { ProductListSearch } from "../ProductListSearch";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../../utils/utils.hooks", () => ({
  useQueryOperators: jest.fn(),
}));

import { useRouter } from "next/router";
import { useQueryOperators } from "../../../utils/utils.hooks";

const properties: Property[] = [
  { id: 0, name: "Product Name", type: "string" },
  { id: 1, name: "color", type: "string" },
  { id: 2, name: "weight (oz)", type: "number" },
  {
    id: 3,
    name: "category",
    type: "enumerated",
    values: ["tools", "electronics", "kitchenware"],
  },
];

describe("ProductListSearch", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    (useQueryOperators as jest.Mock).mockReturnValue({
      operators: [
        { id: "equals", text: "Equals" },
        { id: "any", text: "Has any value" },
        { id: "none", text: "Has no value" },
      ],
      isLoading: false,
    });

    const mockRouter: any = {
      pathname: "/",
      query: {},
      push: jest.fn(({ pathname, query }: any) => {
        mockRouter.pathname = pathname;
        mockRouter.query = query ?? {};
        return Promise.resolve(true);
      }),
      prefetch: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      beforePopState: jest.fn(),
      events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
      basePath: "",
      asPath: "/",
      isReady: true,
      isFallback: false,
      isLocaleDomain: false,
      isPreview: false,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test("renders title and form controls", () => {
    render(<ProductListSearch properties={properties} />);
    expect(
      screen.getByRole("heading", { name: "Products" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Property")).toBeInTheDocument();
    expect(screen.getByLabelText("Operator")).toBeInTheDocument();
  });

  test("selecting a property updates the router query", async () => {
    render(<ProductListSearch properties={properties} />);
    await user.click(screen.getByLabelText("Property"));
    await user.click(screen.getByText("Product Name"));

    const router = useRouter() as any;
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/",
      query: { propertyId: 0 },
    });
    expect(screen.queryByLabelText("Search")).toBeNull();
  });

  test("selecting operator shows Search for string property and pushes query", async () => {
    render(<ProductListSearch properties={properties} />);

    await user.click(screen.getByLabelText("Property"));
    await user.click(screen.getByText("Product Name"));

    await user.click(screen.getByLabelText("Operator"));
    await user.click(screen.getByText("Equals"));

    expect(screen.getByLabelText("Search")).toBeInTheDocument();

    const router = useRouter() as any;
    expect(router.push).toHaveBeenLastCalledWith({
      pathname: "/",
      query: { operator: "equals" },
    });
  });

  test("typing a search value pushes query with propertyId, operator, and search", async () => {
    render(<ProductListSearch properties={properties} />);

    await user.click(screen.getByLabelText("Property"));
    await user.click(screen.getByText("Product Name"));
    await user.click(screen.getByLabelText("Operator"));
    await user.click(screen.getByText("Equals"));

    await user.type(screen.getByLabelText("Search"), "Headphones");

    const router = useRouter() as any;
    expect(router.push).toHaveBeenLastCalledWith({
      pathname: "/",
      query: { operator: "equals", search: "Headphones" },
    });
  });

  test("Clear button resets selection and clears query", async () => {
    render(<ProductListSearch properties={properties} />);

    await user.click(screen.getByLabelText("Property"));
    await user.click(screen.getByText("Product Name"));

    await user.click(screen.getByRole("button", { name: "Clear" }));

    const router = useRouter() as any;
    expect(router.push).toHaveBeenLastCalledWith({
      pathname: "/",
      query: undefined,
    });
  });
});

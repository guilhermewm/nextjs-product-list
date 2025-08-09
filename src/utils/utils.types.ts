export type PropertyType = "string" | "number" | "enumerated";

export interface Property {
  id: number;
  name: string;
  type: PropertyType;
  values?: string[];
}

export interface Product {
  id: number;
  property_values: Array<{
    property_id: number;
    value?: string | number;
  }>;
}

export interface Operator {
  text: string;
  id: string;
}

export interface Datastore {
  getProducts: () => Product[];
  getProperties: () => Property[];
  getOperators: () => Operator[];
  products: Product[];
  properties: Property[];
  operators: Operator[];
}

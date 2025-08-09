import { datastore } from "@/datastore/datastore-server";
import type { NextApiRequest, NextApiResponse } from "next";
import { Operator, Product, Property } from "../../utils/utils.types";
import { isOperatorValid } from "./operators";

type Data = {
  message?: string;
  timestamp?: string;
  status?: string;
  products?: Product[];
  count?: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Product[]>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
      timestamp: new Date().toISOString(),
      status: "error",
    });
  }

  const { propertyId, operator, search } = req.query;

  if (propertyId) {
    const propertyIdNum = parseInt(propertyId as string);
    if (isNaN(propertyIdNum)) {
      return res.status(400).json({
        message: "propertyId must be a valid number",
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }

    const properties = datastore.getProperties();
    const propertyExists = properties.some(
      (prop: Property) => prop.id === propertyIdNum
    );
    if (!propertyExists) {
      return res.status(400).json({
        message: `propertyId ${propertyIdNum} does not exist in properties`,
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }
  }

  if (operator) {
    if (typeof operator !== "string") {
      return res.status(400).json({
        message: "operator must be a string",
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }

    const operators = datastore.getOperators();
    const operatorExists = operators.some((op: Operator) => op.id === operator);
    if (!operatorExists) {
      return res.status(400).json({
        message: `operator '${operator}' is not valid`,
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }
  }

  const propertyIdNum = parseInt(propertyId as string);
  const operatorId = operator as string;

  const properties = datastore.getProperties();
  const property = properties.find(
    (prop: Property) => prop.id === propertyIdNum
  );

  if (property) {
    const validation = isOperatorValid(property?.type, operatorId);

    if (!validation) {
      return res.status(400).json({
        message: `operator '${operator}' and '${property?.type}' combination is not valid`,
        timestamp: new Date().toISOString(),
        status: "error",
      });
    }
  }

  const products = filterProductsByProperty(property, operatorId, search);

  return res.status(200).json(products);
}

function filterProductsByProperty(
  property?: Property,
  operatorStr?: string,
  search?: string | string[] | undefined
): Product[] {
  const searchValue = search as string;
  const propertyIdNum = property?.id;

  const products = datastore.getProducts();
  const shouldSearch =
    ((propertyIdNum !== 0 && !propertyIdNum) ||
      (operatorStr !== "none" && operatorStr !== "any")) &&
    !searchValue;
  if (shouldSearch) {
    return products;
  }

  return products.filter(product => {
    const productFound = product.property_values.find(
      pv => pv.property_id === propertyIdNum
    );

    switch (operatorStr) {
      case "equals":
        if (typeof productFound?.value === "number") {
          return Number(productFound?.value) === Number(searchValue);
        }
        return productFound?.value === searchValue;

      case "greater_than":
        const greaterThan = parseFloat(searchValue);
        return (
          typeof productFound?.value === "number" &&
          !isNaN(greaterThan) &&
          productFound?.value > greaterThan
        );

      case "less_than":
        const lessThan = parseFloat(searchValue);
        return (
          typeof productFound?.value === "number" &&
          !isNaN(lessThan) &&
          productFound?.value < lessThan
        );

      case "contains":
        return (
          typeof productFound?.value === "string" &&
          productFound?.value.toLowerCase().includes(searchValue.toLowerCase())
        );

      case "any":
        return !!productFound;

      case "none":
        const noneProduct = !product.property_values.find(
          pv => pv.property_id === propertyIdNum
        );
        return noneProduct;

      case "in":
        const searchValues = searchValue.split(",").map(s => s.trim());
        if (typeof productFound?.value === "number") {
          return searchValues.includes(String(productFound.value));
        }
        return searchValues.includes(productFound?.value as string);

      default:
        return true;
    }
  });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { datastore } from "../../datastore/datastore-server";
import { Operator, PropertyType } from "../../utils/utils.types";

type Data = {
  message?: string;
  timestamp?: string;
  status?: string;
  operators?: Operator[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Operator[]>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
      timestamp: new Date().toISOString(),
      status: "error",
    });
  }

  const { type } = req.query;

  // Validate propertyType parameter
  if (type && !["string", "number", "enumerated"].includes(type as string)) {
    return res.status(400).json({
      message:
        "Invalid propertyType. Must be 'string', 'number', or 'enumerated'",
      timestamp: new Date().toISOString(),
      status: "error",
    });
  }

  const operators = filterOperatorsByPropertyType(type as PropertyType);
  res.status(200).json(operators);
}

function filterOperatorsByPropertyType(propertyType: PropertyType): Operator[] {
  const operators = datastore.getOperators();
  switch (propertyType) {
    case "string":
      return operators.filter(op =>
        ["equals", "any", "none", "in", "contains"].includes(op.id)
      );
    case "number":
      return operators.filter(op =>
        ["equals", "greater_than", "less_than", "any", "none", "in"].includes(
          op.id
        )
      );
    case "enumerated":
      return operators.filter(op =>
        ["equals", "any", "none", "in"].includes(op.id)
      );
    default:
      return operators;
  }
}

export function isOperatorValid(
  propertyType: PropertyType,
  operatorId: Operator["id"]
): boolean {
  const filteredOperators = filterOperatorsByPropertyType(propertyType);
  return filteredOperators.some(operator => operator.id === operatorId);
}

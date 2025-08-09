import type { NextApiRequest, NextApiResponse } from "next";
import { datastore } from "../../datastore/datastore-server";
import { Property } from "../../utils/utils.types";

type Data = {
  message?: string;
  timestamp?: string;
  status?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Property[]>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
      timestamp: new Date().toISOString(),
      status: "error",
    });
  }

  const properties = datastore.getProperties();
  res.status(200).json(properties);
}

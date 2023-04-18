// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { category } = req.body;
  const result = await prisma.category.create({
    data: {
      name: category,
    },
  });

  res.status(200).json(result);
}

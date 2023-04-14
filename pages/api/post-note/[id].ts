// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const categoryId = req.query.id;
  if (req.method === "DELETE") {
    const category = await prisma.category.delete({
      where: { id: parseInt(categoryId) },
    });
    res.json(category);
  }
}

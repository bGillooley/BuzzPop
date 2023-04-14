// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query["name"].toString();
  console.log(name);
  const result = await prisma.post.findMany({
    where: {
      categories: {
        some: {
          category: {
            name: name,
          },
        },
      },
    },
  });
  console.log(result);
  res.status(200).json(result);
}

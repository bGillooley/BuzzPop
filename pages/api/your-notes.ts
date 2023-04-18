// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const result = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
    },
  });
  console.log(result);
  res.status(200).json(result);
}

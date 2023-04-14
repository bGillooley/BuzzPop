import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { categoryId, content } = req.body;

  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.post.create({
    data: {
      content: content,
      author: { connect: { email: session?.user?.email } },
      categories: {
        create: [
          {
            category: {
              connect: {
                id: parseInt(categoryId),
              },
            },
          },
        ],
      },
    },
  });
  res.json(result);
}

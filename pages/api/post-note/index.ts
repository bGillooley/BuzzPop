import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { getOpenGraphData } from "@/lib/getOpenGraphData";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { categoryId, content, postUrl } = req.body;
  let postTitle = "";
  let postImageUrl = "";

  if (postUrl !== "") {
    const billy = await getOpenGraphData(postUrl);
    postTitle = billy.hybridGraph.title;
    postImageUrl = billy.hybridGraph.imageSecureUrl;
  }

  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.post.create({
    data: {
      content: content,
      postTitle: postTitle,
      postUrl: postUrl,
      postImageUrl: postImageUrl,
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

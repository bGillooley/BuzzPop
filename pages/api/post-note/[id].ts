// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getOpenGraphData } from "@/lib/getOpenGraphData";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;
  console.log("Billy", id);
  if (req.method === "DELETE") {
    const post = await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json(post);
  } else if (req.method === "PUT") {
    console.log(id);
    const { content, postUrl } = req.body;
    let postTitle = "";
    let postImageUrl = "";

    if (postUrl !== "") {
      const billy = await getOpenGraphData(postUrl);
      postTitle = billy.hybridGraph.title;
      postImageUrl = billy.hybridGraph.imageSecureUrl;
    }
    const update = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        content: content,
        postTitle: postTitle,
        postUrl: postUrl,
        postImageUrl: postImageUrl,
      },
    });
    res.json(update);
  }
}

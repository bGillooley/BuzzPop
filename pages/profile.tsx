import { useState, useRef, useEffect } from "react";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import Router, { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }
  const result = await prisma.post.findMany({
    where: {
      author: { email: session?.user?.email },
    },
  });
  const initialResults = JSON.parse(JSON.stringify(result));
  console.log("Now, look: ", initialResults);
  return {
    props: { initialResults },
  };
};

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post-note/${id}`, {
    method: "DELETE",
  });
  Router.reload();
}

const Profile = ({ initialResults }) => {
  const [notesData, setNotesData] = useState(initialResults);
  const inputEl = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session) {
    return <div>Loading</div>;
  }
  return (
    <>
      <div className="w-full min-h-screen bg-slate-100 dark:bg-stone-800 ">
        <div className="fixed z-40">
          <button
            className="text-3xl p-4 rounded-full"
            onClick={() => router.push("/")}
          >
            <MdOutlineArrowBackIosNew />
          </button>
        </div>
        <div className="max-w-2xl px-4 pt-16 mx-auto">
          <div className="p-2 mb-4">
            <h1 className="text-2xl pb-2">Your Profile</h1>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">{session.user.name}</h2>
            </div>
          </div>

          {notesData.map((post) => (
            <div
              key={post.id}
              className="relative bg-white text-sm break-inside-avoid-column whitespace-nowrap rounded-lg shadow-3xl shadow-stone-900 p-4 mb-4"
            >
              <div className="absolute top-2 right-2 p-2 bg-white rounded-lg z-50 flex">
                <Link
                  legacyBehavior
                  href={{
                    pathname: "/update-post",
                    query: post,
                  }}
                >
                  <button className="text-xl text-blue-700">
                    <BsPencilSquare />
                  </button>
                </Link>
                <button
                  className="text-xl ml-4 text-red-700"
                  onClick={() => deletePost(post.id)}
                >
                  <BsTrash />
                </button>
              </div>
              <span className="whitespace-pre-line relative">
                <div className="">
                  <a href={post.postUrl} target="_blank">
                    <img src={post.postImageUrl} />
                  </a>

                  <a
                    href={post.postUrl}
                    className="text-xs text-blue-700 leading-tight"
                    target="_blank"
                  >
                    {post.postTitle}
                  </a>
                </div>

                <div className="">{post.content}</div>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;

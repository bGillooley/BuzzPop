import { useState, useRef, useEffect } from "react";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await prisma.category.findMany();
  return {
    props: { categories },
  };
};

const Update: React.FC = ({ categories }) => {
  const inputEl = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const query = router.query;

  const [content, setContent] = useState(query.content);
  // const [category, setCategory] = useState(query.category);
  const [postUrl, setPostUrl] = useState(query.postUrl);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const id = query.id;
      const body = { content, postUrl };

      await fetch(`/api/post-note/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      inputEl.current.blur();
      inputEl.current.focus();
    }, 0);
  }, []);

  useEffect(() => {
    if (router.isReady) {
    }
  }, []);

  return (
    <>
      <div className="fixed z-40">
        <button className="text-3xl p-4" onClick={() => router.push("/")}>
          <MdOutlineArrowBackIosNew />
        </button>
      </div>
      <div className="max-w-2xl px-4 pt-16 mx-auto">
        <form onSubmit={submitData}>
          <h1 className="text-2xl pb-2">Update note</h1>
          <textarea
            className="w-full mb-2 rounded-md p-2 border-2 border-stone-400"
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="Start typing here..."
            rows={6}
            value={content}
            ref={inputEl}
          />
          <input
            onChange={(e) => setPostUrl(e.target.value)}
            type="text"
            placeholder="Add URL here..."
            value={postUrl}
            className="w-full mb-2 rounded-md p-2 border-2 border-stone-400"
          />
          {/*<div className="mb-4">
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="border-2 rounded-md bg-slate-50 px-1 py-2"
            >
              <option hidden>Place in a category:</option>
              {categories.map((cat) => (
                <option key={cat.id} value={`${cat.name}`}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div> */}
          <input
            className="px-4 py-2 rounded-full font-semibold bg-blue-700 text-white"
            type="submit"
            value="Update Note"
          />
        </form>
      </div>
    </>
  );
};

export default Update;

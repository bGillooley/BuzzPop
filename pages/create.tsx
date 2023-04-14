import { useState, useRef, useEffect } from "react";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await prisma.category.findMany();
  return {
    props: { categories },
  };
};

const Note: React.FC = ({ categories }) => {
  const inputEl = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const filterCategoryId = categories.find((cat) => cat.name === category);
      const categoryId = filterCategoryId.id;
      const body = { categoryId, content };
      await fetch("/api/post-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.push("/");
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

  return (
    <div className="max-w-2xl px-4 pt-12 mx-auto">
      <form onSubmit={submitData}>
        <h1 className="text-2xl pb-4">Add new note</h1>
        <textarea
          className="w-full rounded-md p-2 border-2 border-stone-400"
          onChange={(e) => {
            setContent(e.target.value);
            console.log(content);
          }}
          placeholder="Content"
          rows={8}
          value={content}
          ref={inputEl}
        />
        <div className="mb-4">
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 rounded-md bg-slate-50 px-1 py-2"
          >
            <option hidden>Select from:</option>
            {categories.map((cat) => (
              <option key={cat.id} value={`${cat.name}`}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <input
          className="px-4 py-2 rounded-full font-semibold bg-blue-700 text-white"
          type="submit"
          value="Add note"
        />
      </form>
    </div>
  );
};

export default Note;

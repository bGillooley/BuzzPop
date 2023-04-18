import { useState, useRef, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await prisma.category.findMany();
  return {
    props: { categories },
  };
};

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  Router.reload();
}

export type CategoryProps = {
  name: string;
};

const Category: React.FC = ({ categories }) => {
  const inputEl = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { category };
      await fetch("/api/categories/create-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.replace(router.asPath);
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
    <>
      <div className="fixed z-40">
        <button className="text-3xl p-4" onClick={() => router.push("/")}>
          <MdOutlineArrowBackIosNew />
        </button>
      </div>
      <div className="max-w-2xl px-4 pt-16 mx-auto">
        <form onSubmit={submitData} className="mb-8">
          <h1 className="text-2xl pb-2">Add new category</h1>
          <input
            className="w-full mb-4 rounded-md p-2 border-2 border-stone-400"
            type="text"
            placeholder="Enter a new category..."
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            ref={inputEl}
          />

          <input
            className="px-4 py-2 rounded-full font-semibold bg-blue-700 text-white"
            type="submit"
            value="Add Category"
          />
        </form>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center border-b py-2 shadow-sm my-4"
          >
            <div className="text-xl bold">{cat.name}</div>
            <div
              className="flex text-red-700 cursor-pointer hover:text-red-800"
              onClick={() => deletePost(cat.id)}
            >
              <BsTrash />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Category;

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export type CategoryProps = {
  name: string;
};

const Category: React.FC = () => {
  const inputEl = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { category };
      await fetch("/api/create-category", {
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
    <div className="max-w-2xl pt-36 mx-auto px-4">
      <form onSubmit={submitData}>
        <h1>Add new category</h1>
        <input
          type="text"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          ref={inputEl}
        />

        <input type="submit" value="Add Category" />
      </form>
    </div>
  );
};

export default Category;

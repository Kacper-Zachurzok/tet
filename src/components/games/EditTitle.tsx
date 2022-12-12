import React, { type FormEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type {
  Product,
  ProductSlug,
  ProductTitle,
} from "../../utils/schemas/product";

const EditTitle: React.FC<{
  show: boolean;
  slug: ProductSlug;
  title: ProductTitle;
}> = ({ show, slug, title }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit title</span>,
          gui: () => (
            <EditTitleGUI
              slug={slug}
              title={title}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const EditTitleGUI: React.FC<{
  slug: ProductSlug;
  title: ProductTitle;
  closeModal: () => void;
}> = ({ slug, title: productTitle, closeModal }) => {
  const router = useRouter();
  const [title, setTitle] = useState<ProductTitle>(productTitle);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    fetch(`/api/products/${slug}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (!response.ok) return;
      const product: Product = await response.json();
      router.push(`/games/${product.slug}`);
      closeModal();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <input
        className="w-full rounded-lg border border-slate-400 p-2 text-black placeholder-slate-400 outline-blue-600 dark:border-gray-800 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div>
        <button className="my-3 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditTitle;

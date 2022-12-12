import React, { type FormEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type {
  ProductDescription,
  ProductSlug,
} from "../../utils/schemas/product";

const EditDescription: React.FC<{
  show: boolean;
  slug: ProductSlug;
  description: ProductDescription;
}> = ({ show, slug, description }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit description</span>,
          gui: () => (
            <EditDescriptionGUI
              slug={slug}
              description={description}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const EditDescriptionGUI: React.FC<{
  slug: ProductSlug;
  description: ProductDescription;
  closeModal: () => void;
}> = ({ slug, description: productDescription, closeModal }) => {
  const router = useRouter();
  const [description, setDescription] =
    useState<ProductDescription>(productDescription);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    fetch(`/api/products/${slug}`, {
      method: "PUT",
      body: JSON.stringify({ description }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (!response.ok) return;
      router.push(`/games/${slug}`);
      closeModal();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        className="h-[20em] w-full resize-x rounded-lg border border-slate-400 p-2 text-black placeholder-slate-400 outline-blue-600 dark:border-gray-800 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <button className="my-3 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditDescription;

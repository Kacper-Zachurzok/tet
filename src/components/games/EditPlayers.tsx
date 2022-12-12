import React, { type FormEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type { ProductPlayers, ProductSlug } from "../../utils/schemas/product";

const EditPlayers: React.FC<{
  show: boolean;
  slug: ProductSlug;
  players: ProductPlayers;
}> = ({ show, slug, players }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit players</span>,
          gui: () => (
            <EditPlayersGUI
              slug={slug}
              players={players}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const EditPlayersGUI: React.FC<{
  slug: ProductSlug;
  players: ProductPlayers;
  closeModal: () => void;
}> = ({ slug, players: productPlayers, closeModal }) => {
  const router = useRouter();
  const [players, setPlayers] = useState<ProductPlayers>(productPlayers);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    fetch(`/api/products/${slug}`, {
      method: "PUT",
      body: JSON.stringify({ players }),
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
      <input
        className="w-full rounded-lg border border-slate-400 p-2 text-black placeholder-slate-400 outline-blue-600 dark:border-gray-800 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        type="number"
        min="1"
        placeholder="players"
        value={players}
        onChange={(e) => setPlayers(parseInt(e.target.value))}
      />
      <div>
        <button className="my-3 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditPlayers;

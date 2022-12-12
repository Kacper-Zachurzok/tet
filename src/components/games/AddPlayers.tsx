import React, {
  type FormEventHandler,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type { ProductPlayers } from "../../utils/schemas/product";

const AddPlayers: React.FC<{
  show: boolean;
  players: ProductPlayers;
  setPlayers: Dispatch<SetStateAction<ProductPlayers>>;
}> = ({ show, players, setPlayers }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit players</span>,
          gui: () => (
            <AddPlayersGUI
              players={players}
              setPlayers={setPlayers}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const AddPlayersGUI: React.FC<{
  players: ProductPlayers;
  setPlayers: Dispatch<SetStateAction<ProductPlayers>>;
  closeModal: () => void;
}> = ({
  players: productPlayers,
  setPlayers: productSetPlayers,
  closeModal,
}) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    productSetPlayers(players);
    closeModal();
  };

  const [players, setPlayers] = useState<ProductPlayers>(productPlayers);

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

export default AddPlayers;

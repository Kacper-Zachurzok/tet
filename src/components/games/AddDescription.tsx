import React, {
  type FormEventHandler,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type { ProductDescription } from "../../utils/schemas/product";

const AddDescription: React.FC<{
  show: boolean;
  description: ProductDescription;
  setDescription: Dispatch<SetStateAction<ProductDescription>>;
}> = ({ show, description, setDescription }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit description</span>,
          gui: () => (
            <AddDescriptionGUI
              description={description}
              setDescription={setDescription}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const AddDescriptionGUI: React.FC<{
  description: ProductDescription;
  setDescription: Dispatch<SetStateAction<ProductDescription>>;
  closeModal: () => void;
}> = ({
  description: productDescription,
  setDescription: productSetDescription,
  closeModal,
}) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    productSetDescription(description);
    closeModal();
  };

  const [description, setDescription] =
    useState<ProductDescription>(productDescription);

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

export default AddDescription;

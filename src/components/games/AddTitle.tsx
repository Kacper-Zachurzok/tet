import React, {
  type FormEventHandler,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type { ProductTitle } from "../../utils/schemas/product";

const AddTitle: React.FC<{
  show: boolean;
  title: ProductTitle;
  setTitle: Dispatch<SetStateAction<ProductTitle>>;
}> = ({ show, title, setTitle }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit title</span>,
          gui: () => (
            <AddTitleGUI
              title={title}
              setTitle={setTitle}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const AddTitleGUI: React.FC<{
  title: ProductTitle;
  setTitle: Dispatch<SetStateAction<ProductTitle>>;
  closeModal: () => void;
}> = ({ title: productTitle, setTitle: productSetTitle, closeModal }) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    productSetTitle(title);
    closeModal();
  };

  const [title, setTitle] = useState<ProductTitle>(productTitle);

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

export default AddTitle;

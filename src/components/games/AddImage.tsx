import React, {
  type FormEventHandler,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useModalContext } from "../../hooks/useModal";
import EditButton from "./EditButton";
import type { ProductImage } from "../../utils/schemas/product";

const AddImage: React.FC<{
  show: boolean;
  image: ProductImage;
  setImage: Dispatch<SetStateAction<ProductImage>>;
}> = ({ show, image, setImage }) => {
  const modal = useModalContext();
  if (!show) return null;

  return (
    <EditButton
      onClick={() =>
        modal?.createModal({
          title: () => <span>Edit image</span>,
          gui: () => (
            <AddImageGUI
              image={image}
              setImage={setImage}
              closeModal={modal.closeModal}
            />
          ),
        })
      }
    />
  );
};

const AddImageGUI: React.FC<{
  image: ProductImage;
  setImage: Dispatch<SetStateAction<ProductImage>>;
  closeModal: () => void;
}> = ({ image: productImage, setImage: productSetImage, closeModal }) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    productSetImage(image);
    closeModal();
  };

  const [image, setImage] = useState<ProductImage>(productImage);

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <input
        className="w-full rounded-lg border border-slate-400 p-2 text-black placeholder-slate-400 outline-blue-600 dark:border-gray-800 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        type="text"
        placeholder="image url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <div>
        <button className="my-3 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
};

export default AddImage;

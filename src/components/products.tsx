import React from "react";
import type {
  Product,
  ProductSlug,
  ProductTitle,
} from "../utils/schemas/product";
import type { Permission } from "../utils/schemas/permission";
import permissions, { hasPermissions } from "../utils/permissions";
import Link from "next/link";
import { useModalContext } from "../hooks/useModal";
import ImageFallback from "./imageFallback";

type callbacks = { delete: (slug: ProductSlug) => void };

export const Products: React.FC<{
  products: Product[] | undefined;
  permissions?: Permission;
  callbacks?: callbacks;
}> = ({ products, permissions: userPermissions = 0, callbacks }) => {
  if (!products) return null;

  const canDelete = hasPermissions(userPermissions, permissions.RemoveProduct);

  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          options={{ canDelete }}
          callbacks={callbacks}
        />
      ))}
    </>
  );
};

export const ProductCard: React.FC<{
  product: Product;
  options?: { canDelete?: boolean };
  callbacks?: callbacks;
}> = ({ product, options, callbacks }) => {
  const { title, slug, image, description, players } = product;
  const modal = useModalContext();
  if (!modal) return null;
  const { createModal, closeModal } = modal;

  return (
    <div className="rounded-2xl bg-slate-100 text-black shadow-2xl dark:bg-gray-800 dark:text-white">
      <div className="relative h-[10em] w-[20em]">
        <ImageFallback
          src={image}
          className="absolute h-full w-full rounded-t-2xl object-cover"
        />
        <div className="absolute top-3 right-3 rounded-2xl bg-slate-100 px-3 py-1 text-xl font-semibold text-black shadow-2xl dark:bg-gray-800 dark:text-white">
          <svg className="mr-2 inline h-[1.5em] w-[1.5em] dark:invert">
            <image href="/players.svg" className="h-[1.5em] w-[1.5em]" />
          </svg>
          {players}
        </div>
        {options?.canDelete && (
          <button
            onClick={() =>
              createModal({
                title: () => <span>Are you sure?</span>,
                gui: () => (
                  <DeleteProductGUI
                    title={title}
                    removeProduct={() => callbacks?.delete(slug)}
                    closeModal={closeModal}
                  />
                ),
              })
            }
            className="absolute bottom-3 right-3 rounded-xl bg-red-600 p-2 transition-colors duration-300 ease-in-out hover:bg-red-700"
          >
            <svg className="h-[1em] w-[1em] invert">
              <image href="/bin.svg" className="h-[1em] w-[1em]" />
            </svg>
          </button>
        )}
      </div>
      <div className="px-3 py-2">
        <span className="text-xl font-semibold">{title}</span>
        <div className="relative my-2 h-[4.25em] overflow-hidden text-sm">
          <span className="absolute w-full text-gray-600 line-clamp-3 dark:text-gray-300">
            {description}
          </span>
        </div>
        <Link
          href={`/games/${slug}`}
          className="ml-auto block w-fit rounded-lg bg-blue-600 py-2 px-4 text-center font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700"
        >
          Discover more
        </Link>
      </div>
    </div>
  );
};

const DeleteProductGUI: React.FC<{
  title: ProductTitle;
  removeProduct: () => void;
  closeModal: () => void;
}> = ({ title, removeProduct, closeModal }) => {
  const handleClick = () => {
    removeProduct();
    closeModal();
  };

  return (
    <>
      <div>
        <span className="my-4 block">
          Do you really want to delete{" "}
          <span className="font-semibold text-red-600">{title}</span>?
        </span>
        <button
          onClick={handleClick}
          className="my-3 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};

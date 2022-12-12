import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import type { Product, ProductSlug } from "../utils/schemas/product";
import type { ParsedUrlQuery } from "querystring";

export const useProducts = () => {
  const router = useRouter();

  const [products, setProducts] = useState<Product[] | undefined>();
  const [pages, setPages] = useState<number | undefined>();

  const removeProduct = async (slug: ProductSlug) => {
    await fetch(`/api/products/${slug}`, {
      method: "DELETE",
    }).then(() => {
      setProducts(products?.filter((product) => product.slug != slug));
      updateProducts(router.query);
    });
  };

  const fetchProducts = async (
    params: { search: string; page: number; perPage: number },
    signal?: AbortSignal
  ) => {
    const urlParams = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    await fetch(`/api/products?${urlParams}`, {
      signal,
    })
      .then(async (response) => {
        const products: Product[] = await response.json();
        const totalCount = parseInt(
          response.headers.get("X-Total-Count") || "0"
        );

        const pages = Math.ceil(totalCount / params.perPage);
        setPages(pages);

        setProducts(products);
      })
      .catch((error) => {
        if (error.name == "AbortError")
          return console.log("Products request was cancelled");
        throw error;
      });
  };

  const updateProducts = (query: ParsedUrlQuery) => {
    let { search, perPage: perPageQuery, page: pageQuery } = query;
    search = (Array.isArray(search) ? search.shift() : search) || "";

    perPageQuery = Array.isArray(perPageQuery)
      ? perPageQuery.shift()
      : perPageQuery;
    const perPage = parseInt(perPageQuery || "5");

    pageQuery = Array.isArray(pageQuery) ? pageQuery.shift() : pageQuery;
    const page = parseInt(pageQuery || "0");

    const abortCtrl = new AbortController();
    fetchProducts({ search, page, perPage }, abortCtrl.signal);

    return abortCtrl;
  };

  useEffect(() => {
    const abortCtrl = updateProducts(router.query);
    return () => abortCtrl.abort();
  }, [router.query]);

  return { products, pages, removeProduct };
};

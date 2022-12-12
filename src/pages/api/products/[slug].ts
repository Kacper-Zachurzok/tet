import methodNextApi from "../../../server/utils/methodNextApi";
import restrictedNextApi from "../../../server/utils/restrictedNextApi";
import zodNextApi from "../../../server/utils/zodNextApi";
import permissions from "../../../utils/permissions";
import { productEditSchema, slugSchema } from "../../../utils/schemas/product";
import { prisma } from "../../../server/db/client";
import { z } from "zod";
import slugify from "slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const products = methodNextApi({
  GET: async (req, res) => {
    const query = req.query;
    const { slug } = query;
    if (!slug) return;
    if (typeof slug !== "string") return;

    const product = await prisma.product.findFirst({
      where: { slug },
    });
    if (!product) return res.status(404).json({});
    return res.status(200).json(product);
  },
  PUT: restrictedNextApi(
    permissions.EditProduct,
    zodNextApi(
      { query: z.object({ slug: slugSchema }), body: productEditSchema },
      async (req, res, { body: input, query }) => {
        const data: typeof input & { slug?: string } = input;
        if (data.title) data.slug = slugify(data.title);
        try {
          const product = await prisma.product.update({
            where: {
              slug: query?.slug,
            },
            data,
          });

          return res.status(200).json(product);
        } catch (err) {
          if (!(err instanceof PrismaClientKnownRequestError)) throw err;
          if (err.code === "P2000")
            return res.status(400).json({ error: "Is too long" });
          if (err.code === "P2002")
            return res.status(409).json({ error: "Title is already in use" });
          if (err.code === "P2025") return res.status(404).json({});

          return res.status(500).json({ error: `Database error ${err.code}` });
        }
      }
    )
  ),
  DELETE: restrictedNextApi(
    permissions.RemoveProduct,
    zodNextApi(
      { query: z.object({ slug: slugSchema }) },
      (req, res, { query }) => {
        const { slug } = query;

        prisma.product
          .delete({
            where: {
              slug,
            },
          })
          .then(() => {
            return res.status(204).json({});
          })
          .catch(() => {
            return res.status(404).json({});
          });
      }
    )
  ),
});

export default products;

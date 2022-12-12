import methodNextApi from "../../../server/utils/methodNextApi";
import restrictedNextApi from "../../../server/utils/restrictedNextApi";
import zodNextApi from "../../../server/utils/zodNextApi";
import permissions from "../../../utils/permissions";
import { productSchema } from "../../../utils/schemas/product";
import { prisma } from "../../../server/db/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import slugify from "slugify";

import { z } from "zod";

const products = methodNextApi({
  POST: restrictedNextApi(
    permissions.AddProduct,
    zodNextApi({ body: productSchema }, async (req, res, { body: input }) => {
      try {
        const product = await prisma.product.create({
          data: {
            slug: slugify(input.title),
            title: input.title,
            description: input.description,
            players: input.players,
            image: input.image,
          },
        });
        return res.status(201).json(product);
      } catch (err) {
        if (!(err instanceof PrismaClientKnownRequestError)) throw err;
        if (err.code === "P2002")
          return res.status(409).json({ error: "Title is already in use" });
        return res.status(500).json({ error: `Database error ${err.code}` });
      }
    })
  ),
  GET: zodNextApi(
    {
      query: z.object({
        search: z.string().optional(),
        perPage: z.string().optional(),
        page: z.string().optional(),
      }),
    },
    async (req, res, { query }) => {
      const { search, perPage: perPageQuery, page: pageQuery } = query;
      const perPage = parseInt(perPageQuery || "5");
      const page = parseInt(pageQuery || "0");

      const where = {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      };

      const [products, totalCount] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          skip: page * perPage,
          take: perPage,
        }),
        prisma.product.count({
          where,
        }),
      ]);

      res.setHeader("X-Total-Count", totalCount);
      return res.status(200).json(products);
    }
  ),
});

export default products;

import { userRegisterSchema } from "../../../utils/schemas/user";
import { prisma } from "../../../server/db/client";
import zodNextApi from "../../../server/utils/zodNextApi";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcrypt";
import methodNextApi from "../../../server/utils/methodNextApi";
import permissions from "../../../utils/permissions";

const products = methodNextApi({
  POST: zodNextApi(
    { body: userRegisterSchema },
    async (req, res, { body: input }) => {
      const hash = await bcrypt.hash(input.password, 10);
      try {
        const user = await prisma.user.create({
          data: {
            email: input.email,
            name: input.name,
            password: hash,
            permissions: permissions.EditProduct,
          },
        });
        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          permissions: user.permissions,
        });
      } catch (err) {
        if (!(err instanceof PrismaClientKnownRequestError)) throw err;
        if (err.code === "P2002")
          return res.status(409).json({ error: "Email is already in use" });
        return res.status(500).json({ error: `Database error ${err.code}` });
      }
    }
  ),
});

export default products;

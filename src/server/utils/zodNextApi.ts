import {
  type NextApiRequest,
  type NextApiResponse,
  type NextApiHandler,
} from "next";
import type { z, ZodType } from "zod";

type ZodInput<Schema extends ZodType> = {
  body: Schema;
};
type NextApiHandlerWithZod<Schema extends ZodType> = (
  req: NextApiRequest,
  res: NextApiResponse,
  input: { body: z.infer<Schema> }
) => void;
type ZodNextApi = <Schema extends ZodType>(
  input: ZodInput<Schema>,
  NextApi: NextApiHandlerWithZod<Schema>
) => NextApiHandler;

const zodNextApi: ZodNextApi = (input, NextApi) => {
  const wrapper: NextApiHandler = async (req, res) => {
    const parsed = input.body.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.issues });
    return NextApi(req, res, { body: parsed.data });
  };
  return wrapper;
};

export default zodNextApi;

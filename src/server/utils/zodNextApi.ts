import {
  type NextApiRequest,
  type NextApiResponse,
  type NextApiHandler,
} from "next";
import type { z, ZodType } from "zod";

type NextApiHandlerWithZod<
  BodySchema extends ZodType,
  QuerySchema extends ZodType
> = (
  req: NextApiRequest,
  res: NextApiResponse,
  input: {
    body: z.infer<BodySchema>;
    query: z.infer<QuerySchema>;
  }
) => void;
type ZodNextApi = <BodySchema extends ZodType, QuerySchema extends ZodType>(
  input: {
    body?: BodySchema;
    query?: QuerySchema;
  },
  NextApi: NextApiHandlerWithZod<BodySchema, QuerySchema>
) => NextApiHandler;

const zodNextApi: ZodNextApi = (input, NextApi) => {
  const wrapper: NextApiHandler = async (req, res) => {
    const body = input.body?.safeParse(req.body);
    if (body && !body?.success)
      return res.status(400).json({ errors: body.error.issues });

    const query = input.query?.safeParse(req.query);
    if (query && !query?.success)
      return res.status(400).json({ errors: query.error.issues });

    return NextApi(req, res, { body: body?.data, query: query?.data });
  };
  return wrapper;
};

export default zodNextApi;

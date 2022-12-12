import { type NextApiHandler } from "next";

type Methods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | (string & Record<never, never>);

type MethodNextApi = ({}: {
  [key in Methods]?: NextApiHandler;
}) => NextApiHandler;

const methodNextApi: MethodNextApi = (methods) => {
  const wrapper: NextApiHandler = async (req, res) => {
    if (!req.method) return;
    const NextApi = methods[req.method];
    if (!NextApi) return res.status(404);
    return NextApi(req, res);
  };
  return wrapper;
};

export default methodNextApi;

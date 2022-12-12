import { type NextApiHandler } from "next";
import { getServerAuthSession } from "../common/get-server-auth-session";

type RestrictedNextApi = (
  Permission: number,
  NextApi: NextApiHandler
) => NextApiHandler;

const restrictedNextApi: RestrictedNextApi = (Permission, NextApi) => {
  const wrapper: NextApiHandler = async (req, res) => {
    const session = await getServerAuthSession({ req, res });
    if (!session?.user) return res.status(401).json({});
    if ((session?.user?.permissions & Permission) != Permission)
      return res.status(403).json({});
    return NextApi(req, res);
  };
  return wrapper;
};

export default restrictedNextApi;

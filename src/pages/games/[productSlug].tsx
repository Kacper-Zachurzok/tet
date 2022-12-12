import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import type { Product } from "../../utils/schemas/product";
import { env } from "../../env/server.mjs";
import permissions, { hasPermissions } from "../../utils/permissions";
import { Header } from "../../components/header";
import { useModalContext } from "../../hooks/useModal";
import EditTitle from "../../components/games/EditTitle";
import EditPlayers from "../../components/games/EditPlayers";
import EditDescription from "../../components/games/EditDescription";
import EditImage from "../../components/games/EditImage";
import ImageFallback from "../../components/imageFallback";

export const getServerSideProps: GetServerSideProps<{
  product?: Product;
}> = async (context) => {
  const { productSlug } = context.query;
  const response = await fetch(
    `${env.NEXTAUTH_URL}/api/products/${productSlug}`
  );
  if (!response.ok) return { redirect: { destination: "/" }, props: {} };

  const product: Product = await response.json();
  return {
    props: {
      product,
    },
  };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ product }) => {
  const { data: sessionData } = useSession();
  const modal = useModalContext();

  if (!product) return null;
  if (!modal) return null;
  const { title, slug, image, description, players } = product;

  const userPermissions = sessionData?.user?.permissions || 0;
  const canEdit = hasPermissions(userPermissions, permissions.EditProduct);

  return (
    <>
      <Head>
        <title>Tet: Explore board games</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-400">
        <Header user={sessionData?.user} />
        <div className="mt-6 flex-col rounded-2xl bg-slate-100 text-black shadow-2xl dark:bg-gray-800 dark:text-white lg:mx-[20em]">
          <div className="relative h-[10em]">
            <ImageFallback
              src={image}
              className="absolute h-full w-full rounded-t-2xl object-cover"
            />
            <div className="absolute bottom-3 right-3">
              <EditImage show={canEdit} slug={slug} image={image} />
            </div>
          </div>
          <div className="px-3">
            <div className="pt-2">
              <span className="flex justify-between text-xl font-semibold">
                {title}
                <EditTitle show={canEdit} slug={slug} title={title} />
              </span>
              <div className="flex justify-between rounded-2xl py-2 text-xl font-semibold">
                <div>
                  <svg className="mr-2 inline h-[1.5em] w-[1.5em] dark:invert">
                    <image
                      href="/players.svg"
                      className="h-[1.5em] w-[1.5em]"
                    />
                  </svg>
                  {players}
                </div>
                <EditPlayers show={canEdit} slug={slug} players={players} />
              </div>
            </div>
            <div className="mb-6 mt-3 flex flex-nowrap justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{description}</span>
              <EditDescription
                show={canEdit}
                slug={slug}
                description={description}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
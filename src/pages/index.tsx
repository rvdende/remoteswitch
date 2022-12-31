import { type NextPage } from "next";
import { Navbar } from "@/components/landing";
import Marketing from "@/components/landing/marketing";
import { useSession } from "next-auth/react";
import { App } from "@/components/app";

const Home: NextPage = () => {
  const session = useSession();

  if (session.status === "loading") return <span>loading...</span>;

  if (session.data?.user && session.status === "authenticated") return <App />;

  if (session.status === "unauthenticated")
    return (
      <>
        <Navbar />

        <main>
          <Marketing
            heading="Remotely Switch and Monitor."
            description="Simple. Reliable. Flexible."
          />
        </main>
      </>
    );

  return <div>error.</div>;
};

export default Home;

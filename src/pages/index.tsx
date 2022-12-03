import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

import { Navbar } from "@/components/landing";
import Marketing from "@/components/landing/marketing";
import { useSession } from "next-auth/react";
import { App } from "@/components/app";


const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const session = useSession();

  if (session.data?.user) return <App />

  return (
    <>

      <Navbar
        nav={[
          // { name: 'Home', href: "/", active: false },
          { name: 'Docs', href: '#docs' },
          { name: 'Pricing', href: '#pricing' },
        ]}
      />

      <main>
        <Marketing
          heading="Remotely Switch and Monitor."
          description="Simple. Reliable. Flexible."
          // block={{
          //   heading: "How it works",
          //   description: "We configure what is called a \"deadman switch\" which means the person needs to hold their hand on the button to prove they are still alive. The system reacts when the button is released. In our case it this can be setup as follows:",
          //   blocks: [
          //     {
          //       heading: 'Step 1: Add content',
          //       description:
          //         'Add your message, documents and any other files you would like to send.',
          //       icon: ArrowUpOnSquareStackIcon,
          //     },
          //     {
          //       heading: 'Step 2: Add the recipient(s)',
          //       description:
          //         'Add the people you want to send to. They will recieve a message informing them they have been added and can confirm or choose to block.',
          //       icon: UserPlusIcon,
          //     },
          //     {
          //       heading: 'Step 3: Configure the trigger',
          //       description:
          //         'In the case of the deadman switch you can select how often we should confirm with you if you are still alive. From daily, weekly, monthly to yearly. Configure how long to wait before sending out the note(s).',
          //       icon: BoltIcon,
          //     },
          //   ]
          // }}
        />
      </main>
    </>
  );
};

export default Home;

import { Navbar } from "@/components/navbar/navbar";
import { DataSourceList } from "@/components";

export const App = () => {
  // const add = trpc.realtime.add.useMutation();

  // const realtime = trpc.realtime.onAdd.useSubscription(undefined, {
  //     onData: (post) => {
  //         console.log("realtime! 2", post);
  //     },
  //     onError: (err) => {
  //         console.log(err);
  //     }
  // })

  return (
    <>
      <main className="fixed left-0 top-0 bottom-0 h-full w-full overflow-hidden bg-white transition dark:bg-zinc-900">
        <Navbar />
        {/* <button onClick={() => {
                add.mutate({ text: "hello!" })
            }}>POST</button> */}

        <div className="">
          <DataSourceList />
        </div>
      </main>
    </>
  );
};

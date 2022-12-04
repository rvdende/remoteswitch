import { Navbar } from "@/components/navbar/navbar"
import { trpc } from "@/utils/trpc"
import { useEffect } from "react";
import { DataSourceList } from "@/components";

export const App = () => {
    const add = trpc.realtime.add.useMutation();


    const realtime = trpc.realtime.onAdd.useSubscription(undefined, {
        onData: (post) => {
            console.log("realtime!", post);
        },
        onError: (err) => {
            console.log(err);
        }
    })


    return <>
        <main className="w-full h-full bg-white overflow-hidden fixed left-0 top-0 bottom-0 transition-all dark:bg-zinc-800">
            <Navbar />

            {/* <button onClick={() => {
                add.mutate({ text: "hello!" })
            }}>POST</button> */}

            <div className="flex p-2">
                <DataSourceList />
            </div>

        </main>
    </>

}
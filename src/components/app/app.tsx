import { Navbar } from "@/components/navbar/navbar"

export const App = () => {
    return <>
        <main className="w-full h-full bg-white overflow-hidden fixed left-0 top-0 bottom-0 transition-all dark:bg-zinc-800">
            <Navbar />
        </main>
    </>

}
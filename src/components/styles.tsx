
// https://github.com/tailwindlabs/tailwindcss/issues/7553
const className = {
    h4: "font-bold text-lg mt-6 text-zinc-700 mb-2 dark:text-zinc-100",
    caption: "text-xs uppercase block opacity-50",
    input: "block w-full rounded border-zinc-300 border shadow-sm outline-zinc-200 focus:border-zinc-200 focus:ring-zinc-500 sm:text-sm px-2 py-1",
    body: "block mb-2 font-semibold text-sm",
    button: "bg-blue-500 px-2 py-1 rounded hover:bg-blue-50 text-white text-sm",

    block: "bg-white sm:mx-auto w-full sm:overflow-hidden rounded-2xl border-8 border-zinc-200 shadow-xl mb-10 relative dark:bg-zinc-800 dark:border-zinc-700",
    blockAlt: "border-t-2 bg-zinc-50 p-6 dark:bg-zinc-700 ",

    paper: "shadow-2xl p-2 bg-gradient-to-br from-zinc-50 to-sky-50 border-2 border-zinc-200 rounded-xl dark:from-zinc-900 dark:to-zinc-800 dark:border-zinc-800"
}

export const styles = className;
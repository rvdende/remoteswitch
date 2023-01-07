// https://github.com/tailwindlabs/tailwindcss/issues/7553
const className = {
  h1: "col-span-full pb-8 text-4xl font-bold text-red-500 dark:text-red-600",
  h2: "text-xl font-bold text-zinc-800 dark:text-zinc-200",
  h3: "text-xl font-bold text-indigo-900 dark:text-indigo-600",
  h4: "font-bold text-lg mt-6 text-zinc-700 mb-2 dark:text-zinc-100",
  h5: "text-indigo-900 dark:text-blue-700 font-semibold text-lg",
  p: "text-gray-700 dark:text-gray-300",
  caption: "text-xs uppercase block opacity-50",
  input:
    "block w-full rounded border-zinc-300 border shadow-sm outline-zinc-200 focus:border-zinc-200 focus:ring-zinc-500 sm:text-sm px-2 py-1",
  body: "block mb-2 font-semibold text-sm",
  button: "bg-blue-500 px-2 py-1 rounded hover:bg-blue-50 text-white text-sm",
  block:
    "bg-white sm:mx-auto w-full sm:overflow-hidden rounded-2xl border-8 border-zinc-200 shadow-xl mb-10 relative dark:bg-zinc-800 dark:border-zinc-700",
  blockAlt: "border-t-2 bg-zinc-50 p-6 dark:bg-zinc-700 ",
  hr: "border-gray-300 dark:border-gray-600 my-8",
  paper:
    "shadow-2xl p-2 bg-gradient-to-br from-zinc-50 to-sky-50 border-2 border-zinc-200 rounded-xl dark:from-zinc-900 dark:to-zinc-800 dark:border-zinc-800",
  layout:
    "min-h-screen bg-whiite dark:bg-zinc-700 text-gray-700 dark:text-gray-300",
};

export const styles = className;

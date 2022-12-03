/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import { Chiplet } from './components/chiplet'



export default function HeroSection(
    {
        title = "Catch phrase required here to work",
        description = "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua ad ad non deserunt sunt.",
    }: {
        title: string,
        description: string,
    }) {
    return (
        <div className="relative overflow-hidden">
            <div className="relative pt-4 pb-8 ">

                <main className="">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center">


                            <div>
                                <Chiplet
                                    title="beta"
                                    description="Early Access"
                                    href="/signup"
                                />
                                <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-800 dark:text-white">
                                    {title}
                                </h1>

                                <p className="mt-2 mb--3 text-zinc-500 dark:text-zinc-400 text-2xl">
                                    {description}
                                </p>
                            </div>

                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
}

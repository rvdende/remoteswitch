import { ChevronRightIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import Link from 'next/link'

export const Chiplet = (props: {
    title: string,
    description: string
    href: string
    className?: string
}) => <Link
    href={props.href}
    className={classNames("inline-flex border-2 items-center rounded-full bg-zinc-200 dark:bg-zinc-700 p-1 pr-2 text-zinc-500 dark:text-white dark:hover:text-zinc-200 sm:text-base lg:text-sm xl:text-base border-transparent hover:border-emerald-400 hover:bg-emerald-400 hover:text-white font-bold",
        props.className)}
>
        <span className="rounded-full bg-white px-3 py-0.5 text-sm font-semibold leading-5 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
            {props.title}
        </span>
        <span className="ml-4 text-sm">{props.description}</span>
        <ChevronRightIcon className="ml-2 h-5 w-5 text-zinc-500 dark:text-zinc-300" aria-hidden="true" />
    </Link>


export const ChipletOld = (props: { title: string, description: string }) => <a
    href="#"
    className="inline-flex items-center rounded-full bg-zinc-200 dark:bg-zinc-700 p-1 pr-2 text-zinc-500 dark:text-white hover:text-zinc-800 dark:hover:text-zinc-200 sm:text-base lg:text-sm xl:text-base"
>
    <span className="rounded-full bg-white px-3 py-0.5 text-sm font-semibold leading-5 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
        {props.title}
    </span>
    <span className="ml-4 text-sm">{props.description}</span>
    <ChevronRightIcon className="ml-2 h-5 w-5 text-zinc-500 dark:text-zinc-300" aria-hidden="true" />
</a>
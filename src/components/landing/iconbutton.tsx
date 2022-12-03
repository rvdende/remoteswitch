import classNames from "classnames"
import { ReactNode } from "react"

export const IconButton = (props: {
    srText: string
    onClick?: () => void
    children: ReactNode
    className?: string
}) => {
    return <button
        type="button"
        className={classNames(
            "flex-shrink-0 rounded-full p-1 focus:outline-none transition-all",
            "dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white",
            "bg-transparent text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100",
            props.className
        )}
        onClick={() => {
            if (props.onClick) props.onClick()
        }}
    >
        <span className="sr-only">{props.srText}</span>
        {props.children}
    </button>
}
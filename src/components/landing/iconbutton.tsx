import type { ReactNode } from "react";
import clsx from "clsx";

export const IconButton = (props: {
  srText: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex-shrink-0 rounded-full p-1 transition-all focus:outline-none",
        "dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white",
        "bg-transparent text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500",
        props.className
      )}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
    >
      <span className="sr-only">{props.srText}</span>
      {props.children}
    </button>
  );
};

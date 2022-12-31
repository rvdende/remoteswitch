import type { ReactNode } from "react";

export const Container = (props: { children: ReactNode }) => {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      {props.children}
    </div>
  );
};

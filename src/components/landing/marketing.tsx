import type { SVGProps } from "react";
import HeroSection from "./hero";
import { styles } from "./styles";

interface MarketingBlockContainer {
  heading: string;
  description: string;
  blocks: MarketingBlock[];
}

interface MarketingBlock {
  heading: string;
  description: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
}

export default function Marketing({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden border-t-2 border-zinc-100 bg-zinc-50 py-8 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="relative mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8">
        <HeroSection title={heading} description={description} />
      </div>
    </div>
  );
}

export const HowItWorks = ({ block }: { block: MarketingBlockContainer }) => (
  <>
    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
      {block.heading}
    </h3>
    <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
      {block.description}
    </p>

    <dl className="mt-10 space-y-10">
      {block.blocks.map((item, idx) => (
        <div key={idx} className="relative">
          <dt>
            <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              <item.icon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="ml-16">
              <p className={styles.h4}>{item.heading}</p>
            </div>
          </dt>
          <dd className="mt-2 ml-16 text-base text-zinc-500 dark:text-zinc-400">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  </>
);

export const PatternRight = ({
  className = "text-zinc-200 dark:text-zinc-600",
}: {
  className: string;
}) => (
  <svg
    className="absolute left-full hidden -translate-x-1/2 -translate-y-1/4 transform lg:block"
    width={404}
    height={784}
    fill="none"
    viewBox="0 0 404 784"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
        x={0}
        y={0}
        width={20}
        height={20}
        patternUnits="userSpaceOnUse"
      >
        <rect
          x={0}
          y={0}
          width={4}
          height={4}
          className={className}
          fill="currentColor"
        />
      </pattern>
    </defs>
    <rect
      width={404}
      height={784}
      fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
    />
  </svg>
);

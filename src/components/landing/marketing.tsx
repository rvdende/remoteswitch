import {
    ChatBubbleBottomCenterTextIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline'
import type { SVGProps } from 'react'

import HeroSection from './hero'
import { styles } from './styles'



const communicationFeatures = [
    {
        id: 1,
        name: 'Mobile notifications',
        description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        icon: ChatBubbleBottomCenterTextIcon,
    },
    {
        id: 2,
        name: 'Reminder emails',
        description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        icon: EnvelopeIcon,
    },
]

interface MarketingBlockContainer {
    heading: string,
    description: string,
    blocks: MarketingBlock[]
}

interface MarketingBlock {
    heading: string,
    description: string
    icon: React.ComponentType<SVGProps<SVGSVGElement>>
}

export default function Marketing({
    heading,
    description,
    block
}: {
    heading: string
    description: string
    block?: MarketingBlockContainer
}) {
    return (
        <div className="overflow-hidden bg-zinc-50 dark:bg-zinc-800 py-8 border-t-2 border-zinc-100 dark:border-zinc-700">
            <div className="relative mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8">
                {/* <PatternRight className='text-zinc-200 dark:text-zinc-700' /> */}

                <HeroSection
                    title={heading}
                    description={description}
                />

                {/* <div className="relative">
                    <h2 className="text-center text-xl font-light text-zinc-500 dark:text-zinc-500 sm:text-2xl">
                        {heading}
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-zinc-500">
                        {description}
                    </p>
                </div> */}

                {/* <div className="relative mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="relative col-span-7 lg:mr-10">
                        <FormNote />
                    </div>

                    <div className="relative  mt-10 lg:mt-0 col-span-5 lg:mr-8" aria-hidden="true">
                        <HowItWorks block={block} />
                    </div>
                </div> */}

                
            </div>
        </div>
    )
}




export const HowItWorks = ({ block }: { block: MarketingBlockContainer }) => <>
    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">{block.heading}</h3>
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
                    <div className='ml-16'>
                    <p className={styles.h4}>{item.heading}</p>
                    </div>
                    
                </dt>
                <dd className="mt-2 ml-16 text-base text-zinc-500 dark:text-zinc-400">{item.description}</dd>
            </div>
        ))}
    </dl>
</>

export const PatternRight = ({ className = "text-zinc-200 dark:text-zinc-600" }: { className: string }) => <svg
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
            <rect x={0} y={0} width={4} height={4} className={className} fill="currentColor" />
        </pattern>
    </defs>
    <rect width={404} height={784} fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)" />
</svg>
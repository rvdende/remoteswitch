// import LogoImage from '@/images/logo.png';
// import Image from 'next/image'

// SFP
// export const Logo = () => {
//     return <Image src={LogoImage}
//         width={114}
//         height={30}
//         alt="Scratch Fix Pro"
//         className='invert dark:invert-0'
//     />
// }

import { CpuChipIcon } from '@heroicons/react/24/outline'

export const Logo = () => {
    return <div className='text-sm flex flex-row'>
        <CpuChipIcon className='h-6 w-6 mr-1' />
        <span className='mt-0.5'>
            <span className='font-bold'>Remote</span>
            <span className="">Switch</span>
            <span className="opacity-50 text-sm">.com</span>
        </span>
    </div>
}
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
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import classnames from 'classnames'

import { Container, IconButton } from '@/components/landing'

import { Logo } from '@/components/landing/logo';
import Image from 'next/image'
// import FlagZA from '@/images/flag_za.png';
import { useTheme } from 'next-themes'
import classNames from 'classnames'
import { Chiplet } from '../landing/hero/components/chiplet'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function Navbar(props: {
    nav?: { name: string, href: string, active?: boolean }[]
    search?: boolean
}) {
    const session = useSession();
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (e) {
                const systemThemeUpdate = e.matches ? 'dark' : 'light'
                setTheme(systemThemeUpdate);
            })
    }

    useEffect(() => {
        setMounted(true);
    }, [])

    const DarkMode = () => <IconButton
        srText={(mounted && (currentTheme !== 'dark')) ? 'toggle light mode' : 'toggle dark mode'}
        onClick={() => {
            const systemThemeUpdate = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(systemThemeUpdate)
        }}>
        {mounted ? <>
            {currentTheme === 'dark'
                ? <SunIcon className="h-6 w-6 transition-all :hover:text-zinc-400" aria-hidden="true" />
                : <SunIcon className="h-6 w-6 transition-all text-orange-400 :hover:text-yellow-200" aria-hidden="true" />}
        </> : <SunIcon className="h-6 w-6 transition-all" aria-hidden="true" />}
    </IconButton>

    return (
        <Disclosure as="nav" className="bg-white dark:bg-zinc-900 transition">
            {({ open }) => (
                <>
                    <Container>

                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex items-center px-2 lg:px-0">
                                <div className="flex-shrink-0">
                                    <Logo />
                                </div>

                                {/* <div className="flex-shrink-0">
                                    <Image src={FlagZA}
                                        width={24}
                                        height={24}
                                        alt="Scratch Fix Pro"
                                    />
                                </div> */}

                                <div className="hidden lg:ml-6 lg:block">
                                    <div className="flex space-x-4">
                                        {/* Current: "bg-zinc-900 text-white", Default: "text-zinc-300 hover:bg-zinc-700 hover:text-white" */}
                                        {props.nav?.map((n, nIdx) => <a
                                            key={nIdx}
                                            href={n.href}
                                            className={
                                                classnames('rounded-md px-3 py-2 text-sm font-medium',
                                                    n.active
                                                        ? "text-black bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                                                        : "text-zinc-700 hover:bg-zinc-300 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white")
                                            }
                                        >{n.name}</a>)
                                        }
                                    </div>
                                </div>
                            </div>
                            {props.search ? <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                                <div className="w-full max-w-lg lg:max-w-xs">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search"
                                            name="search"
                                            className={classnames(`transition-all block w-full rounded-md border border-transparent py-2 pl-10 pr-3 leading-5 focus:outline-none sm:text-sm`,
                                                `bg-zinc-100 text-zinc-700 placeholder-zinc-400 focus:border-zinc-300 focus:bg-white focus:text-zinc-500 outline-none hover:bg-zinc-200 hover:border-zinc-200 focus:ring-zinc-300 focus:placeholder-transparent`,
                                                `dark:bg-zinc-700 dark:text-zinc-300 dark:placeholder-zinc-400 dark:focus:border-zinc-700 dark:focus:bg-zinc-700 dark:focus:ring-zinc-700 hover:bg-zinc-600 dark:focus:placeholder-transparent dark:hover:border-zinc-500 dark:focus:text-zinc-300`,
                                            )}
                                            placeholder="Search"
                                            type="search"
                                        />
                                    </div>
                                </div>
                            </div> : null}
                            <div className="flex lg:hidden">

                                <div className='flex flex-row space-x-2 mr-2 mt-1'>
                                    <div className=''><DarkMode /></div>

                                    {session.status === 'authenticated' &&
                                        <div>
                                            <IconButton
                                                srText="View notifications"
                                            >
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </IconButton>
                                        </div>}
                                </div>



                                {/* Mobile menu button */}
                                <Disclosure.Button className={classnames(`inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset`,
                                    `text-zinc-600 hover:bg-zinc-300 hover:text-zinc-800 focus:ring-zinc-300`,
                                    `dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus:ring-zinc-700`
                                )}>


                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="hidden lg:ml-4 lg:block">
                                <div className="flex items-center">
                                    <DarkMode />
                                    
                                    {session.status === 'authenticated' && <>
                                        <IconButton
                                            srText="View notifications"
                                        >
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </IconButton>
                                    </>}

                                    {session.status === 'unauthenticated' ? <>
                                        <Link href="/signin"><button className='ml-4 text-sm opacity-70'>Sign In</button></Link>

                                        <Chiplet
                                            title="beta"
                                            description="Sign Up"
                                            href="/signup"
                                            className='ml-4'
                                        />
                                    </> : <>
                                        <NavBarAvatarMenu />
                                    </>}



                                </div>
                            </div>
                        </div>
                    </Container>


                    <Disclosure.Panel className="lg:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {/* Current: "bg-zinc-900 text-white", Default: "text-zinc-300 hover:bg-zinc-700 hover:text-white" */}
                            {props.nav?.map((m) => <Disclosure.Button
                                key={m.name}
                                as="a"
                                href="#"
                                className={
                                    classNames(m.active ? "block rounded-md bg-zinc-900 px-3 py-2 text-base font-medium text-white"
                                        : "block rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                    )
                                }
                            >
                                {m.name}
                            </Disclosure.Button>
                            )}

                        </div>
                        <div className="bg-zinc-100 pt-0 pb-3 shadow-xl dark:bg-zinc-700">
                            <div className="flex px-5">





                                {session.status === 'authenticated' && <div className='flex flex-row mt-3 space-x-4'>
                                    <AvatarCircle />
                                    <IconButton
                                        srText="View notifications"
                                    >
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </IconButton>
                                </div>}
                            </div>


                            {session.status === 'authenticated' && <div className="mt-3 space-y-1 px-2">
                                {NavBarProfileMenu.map(nav => <Disclosure.Button key={nav.name}
                                    as="a"
                                    href={nav.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                >
                                    {nav.name}
                                </Disclosure.Button>)}
                            </div>}

                            {session.status === 'unauthenticated' && <div className='px-2 mt-3'>
                                <Disclosure.Button
                                    as="a"
                                    href="/signin"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                >
                                    Sign In
                                </Disclosure.Button>

                                <Chiplet
                                    title="beta"
                                    description="Sign Up"
                                    href="/signup"
                                />

                            </div>}
                        </div>


                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}


export const NavBarProfileMenu = [{
    name: "Your Profile",
    href: "/profile"
}, {
    name: "Settings",
    href: "/settings",
}, {
    name: "Sign out",
    href: "/signout"
}]

export const AvatarCircle = () => {
    const session = useSession();

    if (session.status === 'unauthenticated') return null;

    return <div
        className="h-8 pt-1.5 px-3 font-sm font-semibold rounded-full text-zinc-500 bg-zinc-200 bg-opacity-90 dark:bg-zinc-700 dark:text-zinc-300"
    >
        {session.data?.user?.name}
    </div>
}

export const NavBarAvatarMenu = () => {
    const session = useSession();
    {/* Profile dropdown */ }
    return <Menu as="div" className="relative ml-2 flex-shrink-0">
        <div>
            <Menu.Button className="flex rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800">
                <span className="sr-only">Open user menu</span>
                <AvatarCircle />
            </Menu.Button>
        </div>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md overflow-hidden bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-700">
                {NavBarProfileMenu.map(nav => <Menu.Item key={nav.name}>
                    {({ active }) => (
                        <Link
                            href={nav.href}
                            className={classnames(
                                'block px-4 py-2 text-sm ',
                                active ? 'text-zinc-500 dark:text-emerald-500 bg-zinc-100 dark:bg-zinc-600' : 'text-zinc-400',

                            )}
                        >
                            {nav.name}
                        </Link>
                    )}
                </Menu.Item>)}

            </Menu.Items>
        </Transition>
    </Menu>
}


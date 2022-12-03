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
import { Chiplet } from './hero/components/chiplet'
import { NavBarAvatarMenu } from '../navbarAvatarMenu/navbarAvatarMenu'

export function Navbar(props: {
    nav?: { name: string, href: string, active?: boolean }[]
    search?: boolean
}) {
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



    return (
        <Disclosure as="nav" className="bg-white dark:bg-zinc-800">
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

                                    <IconButton
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

                                    <IconButton
                                        srText="View notifications"
                                    >
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </IconButton>


                                    
                                    <NavBarAvatarMenu />
                                    


                                    <Chiplet
                                        title="beta"
                                        description="Sign Up"
                                        href="/signup"
                                        className='ml-4'
                                    />

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
                        <div className="border-t border-zinc-700 pt-4 pb-3">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">Tom Cook</div>
                                    <div className="text-sm font-medium text-zinc-400">tom@example.com</div>
                                </div>
                                <button
                                    type="button"
                                    className="ml-auto flex-shrink-0 rounded-full bg-zinc-800 p-1 text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                >
                                    Your Profile
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                >
                                    Settings
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                >
                                    Sign out
                                </Disclosure.Button>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

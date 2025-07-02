"use client"

import { useState, useEffect, Fragment } from "react"
import {
  getLocales,
  Locale,
  getSelectedLocale,
  setSelectedLocale,
} from "../../../../lib/data/locale"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { ArrowRightMini } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

const LocaleSelect = () => {
  const [locales, setLocales] = useState<Locale[]>([])
  const [locale, setLocale] = useState<Locale | undefined>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getLocales().then(({ locales }) => {
      setLocales(locales)
    })
  }, [])

  useEffect(() => {
    if (!locales.length || locale) {
      return
    }

    getSelectedLocale().then((locale) => {
      const localeDetails = locales.find((l) => l.code === locale)
      setLocale(localeDetails)
    })
  }, [locales])

  useEffect(() => {
    if (locale) {
      setSelectedLocale(locale.code)
    }
  }, [locale])

  const handleChange = (locale: Locale) => {
    setLocale(locale)
    setOpen(false)
  }

  // TODO add return statement
  return (
    <div
      className="flex justify-between"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div>
        <Listbox as="span" onChange={handleChange} defaultValue={locale}>
          <ListboxButton className="py-1 w-full">
            <div className="flex items-start gap-x-2 txt-compact-small">
              <span>Language:</span>
              {locale && (
                <span className="flex items-center gap-x-2 txt-compact-small">
                  {locale.name}
                </span>
              )}
            </div>
          </ListboxButton>
          <div className="relative flex w-full min-w-[320px]">
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                className="xsmall:right-0 -bottom-[calc(100%-36px)] left-0 xsmall:left-auto z-[900] absolute bg-white drop-shadow-md rounded-rounded w-full max-h-[442px] overflow-y-scroll text-black text-small-regular uppercase no-scrollbar"
                static
              >
                {locales?.map((l, index) => {
                  return (
                    <ListboxOption
                      key={index}
                      value={l}
                      className="flex items-center gap-x-2 hover:bg-gray-200 px-3 py-2 cursor-pointer"
                    >
                      {l.name}
                    </ListboxOption>
                  )
                })}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
      <ArrowRightMini
        className={clx(
          "transition-transform duration-150",
          open ? "-rotate-90" : ""
        )}
      />
    </div>
  )
}

export default LocaleSelect

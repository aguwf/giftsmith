import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="group top-0 z-50 sticky inset-x-0">
      <header className="relative bg-white mx-auto border-b border-ui-border-base h-16 duration-200">
        <nav className="flex justify-between items-center w-full h-full text-ui-fg-subtle text-small-regular content-container txt-xsmall-plus">
          <div className="flex flex-1 items-center h-full basis-0">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="hover:text-ui-fg-base uppercase txt-compact-xlarge-plus"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          <div className="flex flex-1 justify-end items-center gap-x-6 h-full basis-0">
            <div className="hidden small:flex items-center gap-x-6 h-full txt-large">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/gift-builder"
                data-testid="nav-gift-builder-link"
              >
                Gift Builder
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full txt-large">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 hover:text-ui-fg-base txt-large"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}

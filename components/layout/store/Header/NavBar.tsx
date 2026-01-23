import React from "react";
import Image from "next/image";
import Link from "next/link";

// Utils & Fonts
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

// Components
import CartBtn from "./CartBtn";
import UserMenu from "./UserMenu";

const NavBar = async () => {
  return (
    <nav className="flex max-w-frame mx-auto items-center justify-between py-2 px-4 xl:px-0">
      <div className="flex items-center">
        {/* Logo */}
        <Link href="/" className="mr-3 lg:mr-10 flex items-center gap-2">
          <Image
            priority
            src="/manifest/favicon.svg"
            height={65}
            width={65}
            alt="logo"
            className="h-[50px] md:h-[55px] w-auto"
          />
          <span className="hidden sm:block bg-black w-[5px] mt-2 h-[28px]"></span>
          <h1
            className={cn([integralCF.className, "hidden sm:block text-3xl"])}
          >
            MEGA SHOP
          </h1>
        </Link>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <CartBtn />
        <UserMenu />
      </div>
    </nav>
  );
};

export default NavBar;

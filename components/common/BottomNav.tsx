"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/layout/store/Header/UserMenu";

// Bootstrap Icons (assume they are globally available or use <i> tags)
// Icon names: house, grid, heart, person

const navItems = [
  { href: "/", label: "Accueil", icon: "house" },
  { href: "/categories", label: "Catégories", icon: "grid" },
  { href: "/favorites", label: "Favoris", icon: "heart" },
  { href: "/profile", label: "Compte", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="bottom-nav" role="navigation">
        {navItems.map((item) => {
          if (item.label === "Compte") {
            return (
              <div key="usermenu" className="bottom-nav-link">
                <UserMenu />
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bottom-nav-link"
              aria-label={item.label}
            >
              <span
                className="bottom-nav-icon"
                aria-hidden="true"
                style={{ color: "white" }}
              >
                <i className={`bi bi-${item.icon}`}></i>
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

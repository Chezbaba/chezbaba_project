"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Bootstrap Icons (assume they are globally available or use <i> tags)
// Icon names: house, grid, heart, person

const navItems = [
  { href: "/", label: "Accueil", icon: "house" },
  { href: "/categories", label: "Catégories", icon: "grid" },
  { href: "/favoris", label: "Favoris", icon: "heart" },
  { href: "/profile", label: "Compte", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" role="navigation">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="bottom-nav-link"
            aria-label={item.label}
          >
            <span
              className={`bottom-nav-icon${isActive ? " active" : ""}`}
              aria-hidden="true"
            >
              <i className={`bi bi-${item.icon}${isActive ? "-fill" : ""}`}></i>
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

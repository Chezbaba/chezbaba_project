import React from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "./BottomNav";

const Navbar = () => {
  return (
    <>
      <nav>
        {/* Desktop/navbar classique */}
        <div className="navBar navBar-desktop">
          {/* Ligne 1: Connexion/Inscription */}
          <div className="navBar_connexion_inscription">
            <p className="navBar_connexion_inscription_text">
              Bonjour!{' '}
              <Link href="/auth/login" className="connexion_link">Connecter vous</Link> ou{' '}
              <Link href="/auth/register" className="inscription_link">Inscrivez-vous</Link>
              <Link href="#" className="aide_link">Aide</Link>
            </p>
            <div className="navBar_connexion_cart">
              <Link href="/cart" className="icone" style={{position: 'relative'}}>
                <i className="bi bi-cart3"></i>
                <span className="cart-badge" style={{background: '#EA9010'}}>0</span>
              </Link>
            </div>
          </div>
          {/* Ligne 2: Logo, recherche, actions */}
          <div className="logo_searchBar_button">
            {/* Logo */}
            <div className="nav_logo">
              <Link href="/" className="logo_link" aria-label="Accueil ChezBaba">
                <Image src="/images/logo-removebg-preview.png" alt="CHEZ BABA" width={120} height={60} className="logo-image" />
              </Link>
            </div>
            {/* Barre de recherche */}
            <form className="search_input_button" style={{flex: 1}}>
              <input type="text" className="search_input" placeholder="Rechercher un produit" />
            </form>
            {/* Boutons à droite */}
            <div className="button_icons" style={{marginLeft: 'auto'}}>
              <Link href="/favorites" className="icone" style={{position: 'relative'}}>
                <i className="bi bi-heart"></i>
              </Link>
              <Link href="/profile" className="icone">
                <i className="bi bi-person"></i>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile : section haute (logo + panier) */}
        <div className="navBar navBar-mobile-top">
          <div className="navBar_mobile_row">
            <div className="nav_logo">
              <Link href="/" className="logo_link" aria-label="Accueil ChezBaba">
                <Image src="/images/logo-removebg-preview.png" alt="CHEZ BABA" width={100} height={50} className="logo-image" />
              </Link>
            </div>
            <div className="navBar_connexion_cart">
              <Link href="/cart" className="icone" style={{position: 'relative'}}>
                <i className="bi bi-cart3"></i>
                <span className="cart-badge" style={{background: '#EA9010'}}>0</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile : section basse (barre de recherche) */}
        <div className="navBar navBar-mobile-bottom">
          <form className="search_input_button" style={{flex: 1}}>
            <input type="text" className="search_input" placeholder="Rechercher un produit" />
            <button type="submit" className="search_icon_btn">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </nav>
      {/* Bottom navigation mobile only */}
      <BottomNav />
    </>
  );
}

export default Navbar;

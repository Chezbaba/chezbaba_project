"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './HeroSlider.module.css';

const slides = [
  {
    title: 'VOTRE CHOIX',
    description: 'Découvrez notre large sélection de vêtements soigneusement conçus pour révéler votre personnalité et sublimer votre style.',
    button: 'Commencer le Shopping',
    image: '/images/hero1.jpg', // à remplacer par ton image
    stats: [
      { value: '0+', label: 'Produits de Qualité' },
      { value: '0+', label: 'Clients Satisfaits' },
      { value: '0+', label: 'Vendeurs de Confiance' },
    ],
    isHero: true,
  },
  {
    title: 'Anticipez Noël avec -10% !',
    description: 'Profitez-en sur de nombreuses catégories et gâtez vos proches.',
    button: "J'en profite",
    image: '/images/jouetsenfant.jfif',
  },
  {
    title: 'Transformez votre maison',
    description: 'Rénovation et design : redonnez vie à votre intérieur avec style et confort.',
    button: 'Découvrir nos projets',
    image: '/images/meuble.jfif',
  },
  {
    title: 'Exprimez votre style',
    description: 'Mode tendance : découvrez nos collections pour un look unique et élégant.',
    button: 'Voir la collection',
    image: '/images/rolex.jpg',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    clearTimeout(timeoutRef.current);
    const duration = current === 0 ? 6000 : 3000;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timeoutRef.current);
  }, [current, mounted]);

  // Affiche toujours la première slide côté serveur pour éviter l'hydratation décalée
  const showIndex = mounted ? current : 0;

  return (
    <div className="hero-slider">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`slide${idx === showIndex ? ' active' : ''}`}
          style={{ opacity: idx === showIndex ? 1 : 0, zIndex: idx === showIndex ? 2 : 1 }}
        >
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            {slide.button && <button className="cta">{slide.button}</button>}
            {slide.isHero && (
              <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                {slide.stats.map((stat, i) => (
                  <div key={i} style={{ borderRight: i < 2 ? '1px solid #ccc' : 'none', padding: '0 1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.value}</div>
                    <div style={{ color: '#555', fontSize: '1rem' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              src={slide.image}
              alt={slide.title}
              width={450}
              height={400}
              className="slide-image"
              style={{ objectFit: 'contain', maxHeight: 350, width: '100%' }}
              priority={idx === 0}
            />
          </div>
        </div>
      ))}
      <div className="pagination">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? 'active' : ''}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

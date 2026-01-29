"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import '../../styles/hero-slider-modern.css';

const slides = [
  {
    title: 'VOTRE CHOIX',
    description: 'Découvrez notre large sélection de vêtements soigneusement conçus pour révéler votre personnalité et sublimer votre style.',
    button: 'Commencer le Shopping',
    image: '/images/hero1.jpg',
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

export default function HeroSliderModern() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    clearTimeout(timeoutRef.current);
    const duration = current === 0 ? 6000 : 3000;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timeoutRef.current);
  }, [current, mounted]);
  const showIndex = mounted ? current : 0;

  return (
    <section className="hero-slider-modern">
      <div className="slider-wrapper-modern">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`slide-modern${idx === showIndex ? ' active' : ''}`}
            style={{ opacity: idx === showIndex ? 1 : 0, zIndex: idx === showIndex ? 2 : 1 }}
          >
            <div className="slide-content-modern">
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              {slide.button && <button className="cta-modern">{slide.button}</button>}
              {slide.isHero && (
                <div className="hero-stats-modern">
                  {slide.stats.map((stat, i) => (
                    <div key={i} className="hero-stat-modern">
                      <div className="hero-stat-value-modern">{stat.value}</div>
                      <div className="hero-stat-label-modern">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="slide-image-modern">
              <Image
                src={slide.image}
                alt={slide.title}
                width={450}
                height={400}
                style={{ objectFit: 'contain', borderRadius: '2rem', width: '100%', maxHeight: 350 }}
                priority={idx === 0}
              />
            </div>
          </div>
        ))}
        <div className="pagination-modern">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={idx === showIndex ? 'active' : ''}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

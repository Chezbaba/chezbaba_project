import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="hero-section-chezbaba">
      <div className="hero-content-chezbaba">
        <div className="hero-text-chezbaba">
          <div className="hero-slogan-chezbaba">
            Découvrez notre large sélection de vêtements soigneusement conçus pour révéler votre personnalité et sublimer votre style.
          </div>
          <h1 className="hero-title-chezbaba">VOTRE CHOIX</h1>
          <p className="hero-desc-chezbaba">
            Découvrez notre large sélection de vêtements soigneusement conçus pour révéler votre personnalité et sublimer votre style.
          </p>
          <button className="hero-btn-chezbaba">Commencer le Shopping</button>
        </div>
        <div className="hero-image-chezbaba">
          <Image
            src="/images/hero1.jpg"
            alt="Vêtements tendance"
            width={400}
            height={400}
            style={{ objectFit: 'contain', borderRadius: '2rem' }}
            priority
          />
        </div>
      </div>
      <div className="hero-stats-chezbaba">
        <div className="hero-stat-chezbaba">
          <div className="hero-stat-value">0+</div>
          <div className="hero-stat-label">Produits de Qualité</div>
        </div>
        <div className="hero-stat-chezbaba">
          <div className="hero-stat-value">0+</div>
          <div className="hero-stat-label">Clients Satisfaits</div>
        </div>
        <div className="hero-stat-chezbaba">
          <div className="hero-stat-value">0+</div>
          <div className="hero-stat-label">Vendeurs de Confiance</div>
        </div>
      </div>
    </section>
  );
}

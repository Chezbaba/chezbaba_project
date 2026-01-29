
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../styles/categories.css';

export default function CategoriesPage() {
  const router = useRouter();
  return (
    <main className="categories-main">
      <HeroSlider />
      <div className="container">
        <div className="page-header">
          <Link href="/" className="back-button" prefetch={false}>
            <i className="bi bi-arrow-left"></i>
          </Link>
          <h1 className="page-title">Catégories</h1>
        </div>
        <div className="categories-grid">
          <Link href={{ pathname: '/products', query: { categorie: 'telephones' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/Smartphone.jfif" alt="Téléphones" className="category-image" width={300} height={300} />
              <div className="category-badge">
                <i className="bi bi-star-fill"></i> Populaire
              </div>
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Téléphones & Accessoires</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'ordinateurs' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/PCportable.jfif" alt="Ordinateurs" className="category-image" width={300} height={300} />
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Ordinateurs & Bureau</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'electronique' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/télévision.jfif" alt="Électronique" className="category-image" width={300} height={300} />
              <div className="category-badge">
                <i className="bi bi-bolt-fill"></i> Nouveau
              </div>
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Électronique</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'quincaillerie' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/meuleuse.jpg" alt="Quincaillerie" className="category-image" width={300} height={300} />
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Quincaillerie</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'maison' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/divan.jfif" alt="Maison & Jardin" className="category-image" width={300} height={300} />
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Maison & Jardin</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'jeux' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/jouetsenfant.jfif" alt="Jeux & Jouets" className="category-image" width={300} height={300} />
              <div className="category-badge">
                <i className="bi bi-fire"></i> Tendance
              </div>
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Jeux & Jouets</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'mode' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/vetementhomme.jfif" alt="Mode" className="category-image" width={300} height={300} />
              <div className="category-badge">
                <i className="bi bi-star-fill"></i> Populaire
              </div>
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Mode</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'travaux' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/tuyaupvc.jpg" alt="Batiment travaux public" className="category-image" width={300} height={300} />
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Batiment travaux public</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'vehicules' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/voiture.jfif" alt="Véhicules" className="category-image" width={300} height={300} />
              <div className="category-badge">
                <i className="bi bi-fire"></i> Tendance
              </div>
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Véhicules</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'livres-medias' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/Livres & Médias.jfif" alt="Livres & Médias" className="category-image" width={300} height={300} />
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Livres & Médias</span>
              </div>
            </div>
          </Link>
          <Link href={{ pathname: '/products', query: { categorie: 'sports-fitness' } }} className="category-card">
            <div className="category-image-container">
              <Image src="/images/Sports & Fitness.jfif" alt="Sports & Fitness" className="category-image" width={300} height={300} />
            </div>
            <div className="category-content">
              <div className="category-title">
                <span className="category-name">Sports & Fitness</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

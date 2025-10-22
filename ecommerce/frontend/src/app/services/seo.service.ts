import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);
  
  private readonly defaultTitle = 'CrunchyPaws - Tienda de Mascotas en Guatemala';
  private readonly defaultDescription = 'La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos. Envío a todo el país.';
  private readonly defaultImage = 'https://crunchypaws.com/assets/images/og-image.jpg';
  private readonly baseUrl = 'https://crunchypaws.com';
  
  setPageTitle(title: string): void {
    const fullTitle = title ? `${title} | CrunchyPaws` : this.defaultTitle;
    this.title.setTitle(fullTitle);
  }
  
  setPageDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
  
  setPageImage(image: string): void {
    const fullImageUrl = image.startsWith('http') ? image : `${this.baseUrl}${image}`;
    this.meta.updateTag({ property: 'og:image', content: fullImageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: fullImageUrl });
  }
  
  setPageUrl(url?: string): void {
    const fullUrl = url ? `${this.baseUrl}${url}` : `${this.baseUrl}${this.router.url}`;
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ name: 'twitter:url', content: fullUrl });
  }
  
  setPageKeywords(keywords: string[]): void {
    this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });
  }
  
  setCanonicalUrl(url?: string): void {
    const canonicalUrl = url ? `${this.baseUrl}${url}` : `${this.baseUrl}${this.router.url}`;
    this.meta.updateTag({ rel: 'canonical', href: canonicalUrl });
  }
  
  setStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  setProductStructuredData(product: any): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.map((img: any) => img.url) || [],
      brand: {
        '@type': 'Brand',
        name: 'CrunchyPaws'
      },
      offers: {
        '@type': 'Offer',
        price: product.final_price,
        priceCurrency: 'GTQ',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'CrunchyPaws'
        }
      },
      aggregateRating: product.reviews?.length > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: this.calculateAverageRating(product.reviews),
        reviewCount: product.reviews.length
      } : undefined
    };
    
    this.setStructuredData(structuredData);
  }
  
  setCategoryStructuredData(category: any): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: `Productos de ${category.name} para mascotas`,
      url: `${this.baseUrl}/catalogo/${category.slug}`
    };
    
    this.setStructuredData(structuredData);
  }
  
  setBreadcrumbStructuredData(breadcrumbs: any[]): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${this.baseUrl}${crumb.url}`
      }))
    };
    
    this.setStructuredData(structuredData);
  }
  
  private calculateAverageRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }
  
  resetToDefaults(): void {
    this.setPageTitle('');
    this.setPageDescription(this.defaultDescription);
    this.setPageImage(this.defaultImage);
    this.setPageUrl();
    this.setPageKeywords(['mascotas', 'perros', 'gatos', 'alimentos', 'accesorios', 'juguetes', 'Guatemala']);
  }
}




import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);

  constructor() {
    // Listen to route changes to update SEO
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSeoForRoute();
      });
  }

  // Update title
  updateTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  // Update meta description
  updateDescription(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
  }

  // Update keywords
  updateKeywords(keywords: string): void {
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }

  // Update Open Graph tags
  updateOpenGraph(data: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    if (data.title) {
      this.metaService.updateTag({ property: 'og:title', content: data.title });
    }
    if (data.description) {
      this.metaService.updateTag({ property: 'og:description', content: data.description });
    }
    if (data.image) {
      this.metaService.updateTag({ property: 'og:image', content: data.image });
    }
    if (data.url) {
      this.metaService.updateTag({ property: 'og:url', content: data.url });
    }
    if (data.type) {
      this.metaService.updateTag({ property: 'og:type', content: data.type });
    }
  }

  // Update Twitter Card tags
  updateTwitterCard(data: {
    title?: string;
    description?: string;
    image?: string;
    card?: string;
  }): void {
    if (data.card) {
      this.metaService.updateTag({ name: 'twitter:card', content: data.card });
    }
    if (data.title) {
      this.metaService.updateTag({ name: 'twitter:title', content: data.title });
    }
    if (data.description) {
      this.metaService.updateTag({ name: 'twitter:description', content: data.description });
    }
    if (data.image) {
      this.metaService.updateTag({ name: 'twitter:image', content: data.image });
    }
  }

  // Update canonical URL
  updateCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  // Update structured data (JSON-LD)
  updateStructuredData(data: any): void {
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

  // Update all SEO tags at once
  updateSeo(data: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    structuredData?: any;
  }): void {
    this.updateTitle(data.title);
    this.updateDescription(data.description);
    
    if (data.keywords) {
      this.updateKeywords(data.keywords);
    }

    this.updateOpenGraph({
      title: data.title,
      description: data.description,
      image: data.image,
      url: data.url,
      type: data.type || 'website'
    });

    this.updateTwitterCard({
      title: data.title,
      description: data.description,
      image: data.image,
      card: 'summary_large_image'
    });

    if (data.url) {
      this.updateCanonicalUrl(data.url);
    }

    if (data.structuredData) {
      this.updateStructuredData(data.structuredData);
    }
  }

  // Update SEO based on current route
  private updateSeoForRoute(): void {
    const currentUrl = this.router.url;
    const baseUrl = window.location.origin;
    
    // Default SEO for routes without specific data
    const defaultSeo = {
      title: 'CrunchyPaws - Productos Deshidratados para Mascotas',
      description: 'Los mejores productos deshidratados para perros y gatos. 100% naturales, sin conservantes.',
      url: baseUrl + currentUrl
    };

    // Route-specific SEO updates can be handled by individual components
    this.updateCanonicalUrl(defaultSeo.url);
  }

  // Generate product structured data
  generateProductStructuredData(product: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'description': product.description,
      'image': product.imageUrl ? [product.imageUrl] : [],
      'brand': {
        '@type': 'Brand',
        'name': 'CrunchyPaws'
      },
      'offers': {
        '@type': 'Offer',
        'price': product.price,
        'priceCurrency': 'GTQ',
        'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': 'CrunchyPaws'
        }
      }
    };
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };
  }
}

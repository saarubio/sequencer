import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
  title = "Free Online MIDI Synthesizer & Piano - Play, Learn & Export Music | The Sequencer",
  description = "Create music with our free online MIDI synthesizer. Play piano, learn notes, create melodies, and export your compositions as MIDI files.",
  keywords = "midi synthesizer, online piano, free synthesizer, music production, midi export, learn music, oscillator, sequencer, electronic music, music creation, virtual piano, music learning",
  image = "https://playmidi.live/og-image.png",
  url = "https://playmidi.live",
  type = "website"
}) => {
  // Update document title
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  // Update meta tags
  React.useEffect(() => {
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', type);
    
    // Update Twitter tags
    updatePropertyTag('twitter:title', title);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image);
    updatePropertyTag('twitter:url', url);
  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
};

export default SEO; 
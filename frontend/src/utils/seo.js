export function applySEOMeta({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
}) {
  if (title) {
    document.title = title;
  }

  const setMeta = (name, content, property = false) => {
    if (!content) return;
    const attr = property ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const setLink = (rel, href) => {
    if (!href) return;
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  setMeta('description', description);
  setMeta('keywords', keywords);
  setMeta('og:title', ogTitle || title, true);
  setMeta('og:description', ogDescription || description, true);
  if (ogImage) setMeta('og:image', ogImage, true);
  setMeta('twitter:title', ogTitle || title);
  setMeta('twitter:description', ogDescription || description);
  if (ogImage) setMeta('twitter:image', ogImage);
  setLink('canonical', canonical);
}

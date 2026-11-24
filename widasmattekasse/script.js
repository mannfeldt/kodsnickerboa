'use strict';
const content = window.WIDAS_CONTENT || {};
const validUrl = (value, host) => {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === host ? url.href : null; } catch { return null; }
};
const stores = [
  { key: 'apple', url: validUrl(content.appStoreUrl, 'apps.apple.com'), rating: content.appStoreRating, label: 'App Store' },
  { key: 'google', url: validUrl(content.playStoreUrl, 'play.google.com'), rating: content.playStoreRating, label: 'Google Play' },
];
for (const store of stores) {
  const link = document.querySelector(`[data-store="${store.key}"]`);
  if (store.url) { link.href = store.url; link.rel = 'noopener noreferrer'; }
  else { link.setAttribute('aria-label', `${store.label} – butikslänk kommer vid lansering`); }
}
if (stores.every(store => store.url)) document.querySelector('#store-status').textContent = 'För iPhone och Android. Börja er nästa upptäckt tillsammans.';
else if (stores.some(store => store.url)) document.querySelector('#store-status').textContent = 'Fler butikslänkar publiceras när de finns tillgängliga.';
if (Array.isArray(content.testimonials) && content.testimonials.length) {
  const target = document.querySelector('#testimonials');
  const reviews = content.testimonials.filter(item => typeof item.quote === 'string' && item.quote.trim() && typeof item.name === 'string' && item.name.trim());
  if (reviews.length) {
    target.replaceChildren(); target.classList.add('has-reviews');
    for (const review of reviews) {
      const article = document.createElement('article'); article.className = 'testimonial-card';
      const quote = document.createElement('blockquote'); quote.textContent = `”${review.quote}”`;
      const name = document.createElement('p'); name.textContent = review.name;
      article.append(quote, name); target.append(article);
    }
  }
}
stores.forEach((store, index) => {
  const rating = store.rating;
  if (rating && Number.isFinite(rating.score) && rating.score >= 1 && rating.score <= 5 && Number.isInteger(rating.count) && rating.count > 0) {
    document.querySelectorAll('#ratings p span')[index].textContent = `${new Intl.NumberFormat('sv-SE', {maximumFractionDigits: 1}).format(rating.score)} av 5 · ${rating.count} betyg`;
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Crochet figurines shown on the shelf page.
//
// Image paths are derived automatically from the title:
//   "Tiny Frog"  →  src: /crochet/tiny_frog.png
//
// Drop the PNG (with transparent background) into public/crochet/ and it'll appear.
// Pieces with no photo yet show a placeholder.
//
// To override a path, set src explicitly on the item.

function titleToSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '_');
}

function resolvePaths(item, index) {
  const slug = titleToSlug(item.title);
  return {
    id: index + 1,
    ...item,
    src: 'src' in item ? item.src : `/crochet/${slug}.png`,
  };
}

export const crochetItems = [
  // Add your figurines here, e.g.:
  { title: 'Miffy',   description: 'Cotton, 2026.' },
  { title: 'Cat',   description: 'Cotton, 2026.' },
  { title: 'Capybara',   description: 'Cotton, 2026.' },
  { title: 'Pusheen',   description: 'Cotton, 2024.' },
  { title: 'Storm Trooper',   description: 'Cotton, 2024.' },
  { title: 'Bunny',   description: 'Cotton, 2024.' },
  { title: 'Tiger',   description: 'Cotton, 2025.' },
  { title: 'Baby Yoda',   description: 'Cotton, 2024.' },
  { title: 'Duck',   description: 'Cotton, 2024.' },
  { title: 'Reindeer',   description: 'Cotton, 2025.' },
].map(resolvePaths);

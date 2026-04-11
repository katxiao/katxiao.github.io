// Ceramic pieces shown in the gallery.
//
// Image paths are derived automatically from the title:
//   "Wavy Bowl"  →  src:      /ceramics/wavy_bowl.jpeg
//                   hoverSrc: /ceramics/wavy_bowl_alt.jpeg
//
// Just drop the files into public/ceramics/ with those names and they'll appear.
// Pieces with no photo yet show a placeholder — no need to set src: null.
//
// To override a path, set src or hoverSrc explicitly on the item.
// To disable the hover image for a specific piece, set hoverSrc: null.

function titleToSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '_');
}

function resolveImagePaths(item, index) {
  const slug = titleToSlug(item.title);
  return {
    id: index + 1,
    ...item,
    src:      'src'      in item ? item.src      : `/ceramics/${slug}.jpeg`,
    hoverSrc: 'hoverSrc' in item ? item.hoverSrc : `/ceramics/${slug}_alt.jpeg`,
  };
}

export const ceramicItems = [
  {
    title: 'Wavy Bowl',           
    description: 'Porcelain, Yellow Salt, 2025.'
  },
  {
    title: 'Splatter Vase',       
    description: 'Porcelain, Yellow Salt & Iron Yellow, 2025.'
  },
  {
    title: 'Step Mug',
    description: 'Porcelain, Blue Brown, 2025.'
  },
  {
    title: 'Blue Spiral Cup',     
    description: 'Porcelain, Turquoise Matte, 2025.'
  },
  {
    title: 'Facet Espresso Cup',  
    description: 'Porcelain, Peter Black & Alpine White, 2025.'
  },
  {
    title: 'Spiral Mug',         
    description: 'Porcelain, Blue Brown, 2025.'
  },
  {
    title: 'Blue Brown Espresso Cup',
    description: 'Porcelain, Blue Brown, 2025.'
  },
  {
    title: 'Seafoam Mug',        
    description: 'Porcelain, Seafoam & Alpine White, 2025.'
  },
].map(resolveImagePaths);

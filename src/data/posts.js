// Blog post content lives in src/content/posts/<slug>.md
// Add a new post by:
//   1. Creating src/content/posts/your-slug.md
//   2. Importing it below with `?raw`
//   3. Adding an entry to the posts array

import onMakingContent from '../content/posts/on-making.md?raw';
import placeholderContent from '../content/posts/placeholder-post.md?raw';

export const posts = [
  {
    slug: 'on-making',
    title: 'On Making',
    date: '2025-03-15',
    excerpt:
      'Thoughts on the act of creation, and why making things by hand feels so different from making things on a screen.',
    content: onMakingContent,
  },
  {
    slug: 'placeholder-post',
    title: 'Post title',
    date: '2025-02-01',
    excerpt: 'A short summary of what this post is about — one or two sentences.',
    content: placeholderContent,
  },
];

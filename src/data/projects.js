// Project content lives in src/content/projects/<slug>.md
// Add a new project by:
//   1. Creating src/content/projects/your-slug.md
//   2. Importing it below with `?raw`
//   3. Adding an entry to the projects array
//
// images   : array of paths, e.g. ['/projects/foo/photo.jpg']
//            (place files in the public/ folder)
// videoUrl : YouTube embed URL ('https://www.youtube.com/embed/VIDEO_ID')
//            or a local video path ('/projects/foo/demo.mp4')
// link     : optional external URL shown as a button on the project page

import ceramicSensorContent from '../content/projects/ceramic-sensor.md?raw';
import glazeCalculatorContent from '../content/projects/glaze-calculator.md?raw';
import placeholderContent from '../content/projects/placeholder-project.md?raw';

export const projects = [
  {
    id: 1,
    slug: 'ceramic-sensor',
    title: 'Ceramic Moisture Sensor',
    type: 'hardware',
    date: '2025-01',
    tags: ['Arduino', 'ceramics', 'sensors'],
    description:
      'A capacitive moisture sensor embedded inside a wheel-thrown planter. ' +
      'The clay body acts as the dielectric; an exterior LED changes colour when the soil is dry.',
    images: [],
    videoUrl: null,
    link: null,
    content: ceramicSensorContent,
  },
  {
    id: 2,
    slug: 'glaze-calculator',
    title: 'Glaze Recipe Calculator',
    type: 'software',
    date: '2024-11',
    tags: ['React', 'chemistry'],
    description:
      'A web tool for balancing glaze recipes by molecular weight, outputting Unity Molecular Formula ' +
      'values and a predicted colour swatch.',
    images: [],
    videoUrl: null,
    link: null,
    content: glazeCalculatorContent,
  },
  {
    id: 3,
    slug: 'placeholder-project',
    title: 'Project title',
    type: 'software',
    date: '2024-09',
    tags: ['tag1', 'tag2'],
    description:
      'A one-paragraph summary shown on the listing page. Keep it to two or three sentences.',
    images: [],
    videoUrl: null,
    link: null,
    content: placeholderContent,
  },
];

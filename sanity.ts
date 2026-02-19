
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'aoav5un7', // Replace with your Sanity project ID
  dataset: 'production',         // Replace with your dataset name
  useCdn: true,                  // `false` if you want to ensure fresh data
  apiVersion: '2023-05-03',      // Use a current date for API versioning
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

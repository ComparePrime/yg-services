import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

/**
 * Blog évolutif : chaque article est un fichier Markdown dans /content/blog.
 * Pour publier, il suffit d'ajouter un fichier .md avec son en-tête.
 * Aucune modification de code n'est nécessaire.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export const blogCategories = [
  'Création web',
  'SEO',
  'Assurances',
  'Logement',
  'Administratif',
  'Économies',
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: BlogCategory;
  author: string;
  metaTitle: string;
  metaDescription: string;
  image?: string;
  imageAlt?: string;
  readingTime: number;
  draft: boolean;
};

export type Post = PostMeta & { html: string };

function readFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
}

function parse(file: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = (data.slug as string) ?? file.replace(/\.md$/, '');
  const words = content.trim().split(/\s+/).length;

  const meta: PostMeta = {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: data.category as BlogCategory,
    author: (data.author as string) ?? 'Yoann Guiot',
    metaTitle: (data.metaTitle as string) ?? (data.title as string),
    metaDescription: (data.metaDescription as string) ?? (data.description as string),
    image: data.image as string | undefined,
    imageAlt: data.imageAlt as string | undefined,
    readingTime: Math.max(1, Math.round(words / 200)),
    draft: Boolean(data.draft),
  };

  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  return readFiles()
    .map((file) => parse(file).meta)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = readFiles().find((f) => f.replace(/\.md$/, '') === slug);
  if (!file) return null;

  const { meta, content } = parse(file);
  if (meta.draft) return null;

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);

  return { ...meta, html: String(processed) };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

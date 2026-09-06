import Link from 'next/link';
import { formatDate, type PostMeta } from '@/lib/blog';
import { ArrowRight } from '@/components/ui/Check';

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
      <div className="flex items-center gap-3 text-xs text-ink-500">
        <span className="rounded-full bg-accent-50 px-2.5 py-1 font-medium text-accent-800">
          {post.category}
        </span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">•</span>
        <span>{post.readingTime} min</span>
      </div>

      <h3 className="mt-4 font-display text-xl leading-snug text-ink-900">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-600">{post.description}</p>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-900">
        Lire l’article
        <ArrowRight className="transition group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  readingMinutes,
  formatPublished,
  type BlogPost,
} from "@/data/blog";

interface BlogCardProps {
  post: BlogPost;
}

/**
 * A blog preview card linking to the full article.
 *
 * The author image is the Royal Home Solutions brand mark, not a portrait —
 * these articles are published by the company. Stock human portraits were
 * removed here (see the note in `data/blog.ts`).
 *
 * Reading time is computed from the article's real word count, never typed in.
 */
export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col rounded-3xl bg-neutral-50 p-6 transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <time dateTime={post.publishedAt}>
            {formatPublished(post.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(post)} min read</span>
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-snug text-brand-ink">
          {post.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
          {post.description}
        </p>

        <div className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-5">
          <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-white">
            <Image
              src="/Assets/Images/Brand-mark.png"
              alt=""
              fill
              sizes="36px"
              className="object-contain p-1"
            />
          </span>
          <p className="text-sm font-medium text-brand-ink">{post.author}</p>
          <ArrowRight
            className="ml-auto h-4 w-4 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </Link>
    </article>
  );
}

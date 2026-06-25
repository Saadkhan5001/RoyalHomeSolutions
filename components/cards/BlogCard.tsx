import Image from "next/image";
import type { BlogPost } from "@/data/blog";

interface BlogCardProps {
  post: BlogPost;
}

/**
 * A blog preview card: category and read time, title, author row, then the
 * article image.
 */
export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl bg-neutral-50 p-5 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white">
          {post.category}
        </span>
        <span className="text-xs text-neutral-500">{post.readTime}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-brand-ink">
        {post.title}
      </h3>

      <div className="mt-4 flex items-center gap-3 border-t border-neutral-200 pt-4">
        <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={post.authorAvatar}
            alt={`Portrait of ${post.authorName}`}
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
        <div>
          <p className="text-sm font-semibold text-brand-ink">
            {post.authorName}
          </p>
          <p className="text-xs text-neutral-500">{post.authorRole}</p>
        </div>
      </div>

      <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 768px) 90vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </article>
  );
}

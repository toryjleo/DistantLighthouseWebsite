import { Link } from 'react-router-dom'
import { getNewsletterPosts } from '../data/newsletter'

const posts = getNewsletterPosts()

function Newsletter() {
  return (
    <section className="relative min-h-screen px-6 pb-20 pt-12 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Newsletter
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Field notes, launches, and deep dives.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/70">
            A running log of new releases, strategy memos, and build updates.
            Newest entries appear first so you can catch up fast.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/70">
            No newsletter posts yet. Add a Markdown file to
            <span className="ml-1 font-semibold text-white">src/content/newsletter</span>
            to publish your first entry.
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition hover:border-white/30"
              >
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/50">
                  <span>{post.dateLabel || 'Undated'}</span>
                  {post.author && (
                    <span className="text-white/30">{post.author}</span>
                  )}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {post.title}
                </h2>
                {post.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {post.summary}
                  </p>
                )}
                <Link
                  to={`/newsletter/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/70 transition group-hover:text-white"
                >
                  Read entry
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Newsletter

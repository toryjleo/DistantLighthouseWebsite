import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { getNewsletterPost } from '../data/newsletter'

marked.use({ mangle: false, headerIds: false })

function NewsletterPost() {
  const { slug } = useParams()
  const post = useMemo(() => getNewsletterPost(slug), [slug])

  if (!post) {
    return (
      <section className="min-h-screen px-6 pb-20 pt-12 sm:px-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/70">
          That newsletter entry was not found.
          <Link
            to="/newsletter"
            className="ml-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white"
          >
            Back to Newsletter
          </Link>
        </div>
      </section>
    )
  }

  const html = marked.parse(post.content)

  return (
    <article className="min-h-screen px-6 pb-24 pt-12 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Newsletter
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/50">
            <span>{post.dateLabel || 'Undated'}</span>
            {post.author && <span className="text-white/30">{post.author}</span>}
          </div>
          <Link
            to="/newsletter"
            className="text-xs uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
          >
            Back to Newsletter
          </Link>
        </div>

        <div
          className="newsletter-content space-y-6 text-sm text-white/75"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  )
}

export default NewsletterPost

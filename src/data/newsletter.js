const postModules = import.meta.glob('../content/newsletter/*.md', {
  eager: true,
  as: 'raw',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const parseFrontmatter = (raw) => {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw.trim() }
  }

  const endIndex = raw.indexOf('\n---', 3)
  if (endIndex === -1) {
    return { data: {}, content: raw.trim() }
  }

  const frontmatter = raw.slice(3, endIndex).trim()
  const content = raw.slice(endIndex + 4).trim()
  const data = {}

  for (const line of frontmatter.split('\n')) {
    if (!line.trim()) continue
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue
    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }

  return { data, content }
}

const createSlug = (path) => path.split('/').pop().replace(/\.md$/, '')

const normalizeDate = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const buildPost = ([path, raw]) => {
  const slug = createSlug(path)
  const { data, content } = parseFrontmatter(raw)
  const date = normalizeDate(data.date)

  return {
    slug,
    title: data.title || slug.replace(/[-_]/g, ' '),
    summary: data.summary || '',
    author: data.author || '',
    date,
    dateLabel: date ? dateFormatter.format(date) : '',
    content,
  }
}

const newsletterPosts = Object.entries(postModules)
  .map(buildPost)
  .sort((a, b) => {
    const aTime = a.date ? a.date.getTime() : 0
    const bTime = b.date ? b.date.getTime() : 0
    if (aTime !== bTime) return bTime - aTime
    return a.slug.localeCompare(b.slug)
  })

export const getNewsletterPosts = () => newsletterPosts

export const getNewsletterPost = (slug) =>
  newsletterPosts.find((post) => post.slug === slug)

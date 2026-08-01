import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ContentBlocks from '../components/ContentBlocks';
import FAQAccordion from '../components/FAQAccordion';
import PostCard, { formatDate, categoryLabel } from '../components/PostCard';
import NotFoundPage from './NotFoundPage';
import { BLOG_POSTS, postsInCategory } from '../seo/allRoutes';
import { applySEO } from '../utils/seo';

/**
 * /blog/:slug
 *
 * Uses its own hero rather than PageHero because a post needs the category,
 * publication date and reading time in the header, and needs the title
 * left-aligned over a measured column rather than centred.
 *
 * An unknown slug renders NotFoundPage, which carries a noindex. Falling
 * through to the homepage — the site's previous behaviour for any unmatched
 * URL — makes every mistyped link look like a real page to a crawler.
 */
const BlogPostPage = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const path = post?.path;

  useEffect(() => {
    if (!path) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO(path);
  }, [path]);

  if (!post) return <NotFoundPage />;

  // Same category first, then anything else, so the suggestions stay relevant
  // on categories that only have one post so far.
  const related = [
    ...postsInCategory(post.category).filter((p) => p.slug !== post.slug),
    ...BLOG_POSTS.filter(
      (p) => p.category !== post.category && p.slug !== post.slug
    ),
  ].slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #fff6f0 0%, #fff 60%, #f0f4ff 100%)',
          borderBottom: '1px solid #f0f0f0',
          padding: '3rem 1.5rem 2.75rem',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {/* Visible breadcrumb, mirroring the BreadcrumbList JSON-LD. */}
          <nav
            aria-label="Breadcrumb"
            style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              marginBottom: '1.25rem',
            }}
          >
            <Link to="/" style={{ color: '#9A3412', textDecoration: 'none' }}>
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link to="/blog" style={{ color: '#9A3412', textDecoration: 'none' }}>
              Blog
            </Link>
            <span aria-hidden="true"> / </span>
            <Link
              to={`/blog/category/${post.category}`}
              style={{ color: '#9A3412', textDecoration: 'none' }}
            >
              {categoryLabel(post.category)}
            </Link>
          </nav>

          <h1
            style={{
              fontSize: 'clamp(1.85rem, 4.2vw, 2.85rem)',
              fontWeight: 800,
              color: '#1a202c',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              margin: '0 0 1rem',
            }}
          >
            {post.h1}
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              lineHeight: 1.75,
              margin: '0 0 1.5rem',
            }}
          >
            {post.intro}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap',
              fontSize: '0.86rem',
              color: '#6b7280',
            }}
          >
            <span style={{ fontWeight: 600, color: '#9A3412' }}>SkillKoder</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published}>{formatDate(post.published)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>
      </header>

      <article style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>
        <ContentBlocks blocks={post.blocks} />

        {post.faqs?.length > 0 && (
          <section style={{ marginTop: '3rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.35rem',
                letterSpacing: '-0.02em',
              }}
            >
              Frequently asked questions
            </h2>
            <FAQAccordion items={post.faqs} allowMultiple defaultOpen={0} />
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #FFF7F2 100%)',
            borderTop: '1px solid #FFE2D2',
            padding: '3rem 1.5rem',
          }}
        >
          <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginTop: 0,
                marginBottom: '1.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              Keep reading
            </h2>
            <div
              className="blog-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '1.35rem',
              }}
            >
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default BlogPostPage;

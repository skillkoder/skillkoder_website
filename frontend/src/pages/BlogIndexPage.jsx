import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PostCard from '../components/PostCard';
import {
  BLOG_CATEGORIES,
  postsNewestFirst,
  postsInCategory,
  findRoute,
} from '../seo/allRoutes';
import { applySEO } from '../utils/seo';

/**
 * /blog and /blog/category/:slug.
 *
 * One component serves both, because a category listing is the blog index with
 * a filter applied — separate components would have duplicated the card grid,
 * the category nav and the empty state for no benefit.
 *
 * The category nav is rendered on both, which gives every category page an
 * inbound link from every other. On a new blog with no external links yet,
 * that internal structure is most of what a crawler has to work with.
 */
const BlogIndexPage = () => {
  const { category } = useParams();
  const path = category ? `/blog/category/${category}` : '/blog';

  const route = findRoute(path);
  const posts = category ? postsInCategory(category) : postsNewestFirst();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO(path);
  }, [path]);

  // An unknown category slug: keep the chrome, say so plainly, offer the way back.
  const unknownCategory = category && !route;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="SKILLKODER BLOG"
        title={unknownCategory ? 'Category' : route?.h1 || 'Data & AI Articles'}
        accent={unknownCategory ? 'Not Found' : ''}
        lead={
          unknownCategory
            ? 'That category does not exist. Pick one below, or browse everything.'
            : route?.intro
        }
      />

      <section style={{ maxWidth: '1150px', margin: '0 auto', padding: '2.5rem 1.5rem 3.5rem' }}>
        {/* Category navigation */}
        <nav
          aria-label="Blog categories"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            marginBottom: '2.5rem',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/blog"
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              textDecoration: 'none',
              border: '1px solid #FFE2D2',
              background: !category ? '#C2410C' : '#ffffff',
              color: !category ? '#ffffff' : '#9A3412',
            }}
          >
            All posts
          </Link>
          {BLOG_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/blog/category/${c.slug}`}
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                padding: '0.5rem 1.1rem',
                borderRadius: '999px',
                textDecoration: 'none',
                border: '1px solid #FFE2D2',
                background: category === c.slug ? '#C2410C' : '#ffffff',
                color: category === c.slug ? '#ffffff' : '#9A3412',
              }}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {posts.length > 0 ? (
          <div
            className="blog-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.35rem',
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p
            style={{
              textAlign: 'center',
              color: '#4b5568',
              lineHeight: 1.8,
              padding: '2rem 0',
            }}
          >
            No posts in this category yet.{' '}
            <Link to="/blog" style={{ color: '#C2410C', fontWeight: 600 }}>
              Browse all posts
            </Link>
            .
          </p>
        )}

        {/* Every listing page links onward to the commercial pages. */}
        <div
          style={{
            marginTop: '3rem',
            background: 'linear-gradient(135deg, #FFF5F0 0%, #ffffff 100%)',
            border: '1px solid #FFE2D2',
            borderRadius: '20px',
            padding: '2.25rem 2rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 2.4vw, 1.65rem)',
              fontWeight: 800,
              color: '#1f2937',
              marginTop: 0,
              marginBottom: '0.75rem',
            }}
          >
            Reading about it is the easy part
          </h2>
          <p
            style={{
              color: '#4b5568',
              lineHeight: 1.75,
              maxWidth: '540px',
              margin: '0 auto 1.6rem',
            }}
          >
            Our programs turn this material into skills you can demonstrate — live
            classes, real projects and career support.
          </p>
          <Link
            to="/courses"
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.7rem',
              fontWeight: 700,
              borderRadius: '0.8rem',
              background: 'linear-gradient(135deg, #C2410C, #9A3412)',
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            Compare all courses
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default BlogIndexPage;

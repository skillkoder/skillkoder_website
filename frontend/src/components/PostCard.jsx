import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_CATEGORIES } from '../seo/allRoutes';

/** Human date without pulling in a date library for one format. */
export const formatDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
};

export const categoryLabel = (slug) =>
  BLOG_CATEGORIES.find((c) => c.slug === slug)?.label || slug;

/**
 * Blog post teaser, shared by /blog and the category pages.
 *
 * The whole card is not a single link: the title and the category badge are
 * separate targets, so a reader can jump to the category without opening the
 * post. Wrapping everything in one <a> would also nest the category link
 * inside it, which is invalid HTML and breaks keyboard navigation.
 */
const PostCard = ({ post }) => (
  <article
    style={{
      background: '#ffffff',
      border: '1px solid #FFE2D2',
      borderRadius: '18px',
      padding: '1.6rem',
      boxShadow: '0 12px 36px rgba(194, 65, 12, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        flexWrap: 'wrap',
        marginBottom: '0.85rem',
      }}
    >
      <Link
        to={`/blog/category/${post.category}`}
        style={{
          fontSize: '0.76rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#9A3412',
          background: '#FFE8DC',
          padding: '0.3rem 0.7rem',
          borderRadius: '999px',
          textDecoration: 'none',
          border: '1px solid #FFD9C4',
        }}
      >
        {categoryLabel(post.category)}
      </Link>
      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
        {post.readingMinutes} min read
      </span>
    </div>

    <h3
      style={{
        fontSize: '1.2rem',
        fontWeight: 800,
        lineHeight: 1.35,
        margin: '0 0 0.7rem',
        letterSpacing: '-0.01em',
      }}
    >
      <Link
        to={post.path}
        style={{ color: '#1f2937', textDecoration: 'none' }}
      >
        {post.h1}
      </Link>
    </h3>

    <p
      style={{
        color: '#4b5568',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 1.25rem',
        flex: 1,
      }}
    >
      {post.excerpt}
    </p>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      <time
        dateTime={post.published}
        style={{ fontSize: '0.82rem', color: '#6b7280' }}
      >
        {formatDate(post.published)}
      </time>
      <Link
        to={post.path}
        style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#C2410C',
          textDecoration: 'none',
          borderBottom: '2px solid #FFD9C4',
          paddingBottom: '2px',
        }}
      >
        Read →
      </Link>
    </div>
  </article>
);

export default PostCard;

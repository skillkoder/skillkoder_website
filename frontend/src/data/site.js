/**
 * Single source of truth for the contact details that appear in CTAs.
 *
 * These were previously hard-coded in three places — Contact.jsx, Hero.jsx and
 * the Organization JSON-LD in public/index.html. A phone number that disagrees
 * with the one in structured data is a trust signal Google actively checks, so
 * they need to be edited in one place.
 *
 * public/index.html cannot import this file (it is a static template), so if
 * PHONE or EMAIL changes, update the JSON-LD block there to match.
 */

export const PHONE_DISPLAY = '+91 99515 99922';
export const PHONE_E164 = '+919951599922';
export const PHONE_TEL = 'tel:+919951599922';

export const EMAIL = 'Skillkoder2025@gmail.com';
export const EMAIL_HREF = 'mailto:Skillkoder2025@gmail.com';

export const LOCATION = 'Hyderabad, India';

/**
 * 1:1 chat with the team. Distinct from the community group invite used on the
 * hero (WHATSAPP_GROUP) — a "chat with us" CTA should open a private thread,
 * not drop the visitor into a group of strangers.
 */
export const WHATSAPP_CHAT =
  'https://wa.me/919951599922?text=' +
  encodeURIComponent(
    "Hi SkillKoder, I'd like to know more about your courses and book a free demo class."
  );

export const WHATSAPP_GROUP =
  'https://chat.whatsapp.com/GlHfkuwLD2Q0Rd8pBDVWoj?mode=wwt';

/**
 * Google Apps Script endpoint that writes form submissions to a sheet.
 *
 * Also hard-coded inside RegistrationModal.jsx and EnrollmentModal.jsx, which
 * predate this file. If the script URL is ever rotated, those two need updating
 * as well — this constant does not reach them.
 */
export const LEAD_CAPTURE_URL =
  'https://script.google.com/macros/s/AKfycbyJ2RwSHwZiBYKBr71Qpcv6H9HiT5okqHuOOdWu_QBhxphZsRctyoQxtmXDG5kyJ3VM/exec';

/** Opens the registration modal that Navbar.jsx keeps mounted app-wide. */
export const openDemoModal = () =>
  window.dispatchEvent(new CustomEvent('skillkoder:openRegistration'));

/**
 * Opens the brochure download modal, optionally preselecting a course.
 * `course` must match one of the labels in BrochureModal's BROCHURES list.
 */
export const openBrochureModal = (course = '') =>
  window.dispatchEvent(
    new CustomEvent('skillkoder:openBrochure', { detail: { course } })
  );

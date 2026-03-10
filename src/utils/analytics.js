import { logEvent } from 'firebase/analytics';
import { analytics, db } from '../firebase-config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

/**
 * Log a custom analytics event.
 * Dual-writes to Firebase Analytics (for Google's dashboards) AND
 * to a Firestore `analytics_events` collection (for our real-time admin dashboard).
 * Silently no-ops on failure — analytics should never break the app.
 */
function trackEvent(eventName, params = {}) {
  // Firebase Analytics (delayed, goes to Google)
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (e) {
      // silent
    }
  }

  // Firestore (real-time, queryable from our dashboard)
  try {
    addDoc(collection(db, 'analytics_events'), {
      event: eventName,
      params,
      timestamp: Timestamp.now(),
      // Date parts for easy querying/grouping
      date: new Date().toISOString().slice(0, 10), // "2026-03-09"
      hour: new Date().getHours(),
    });
  } catch (e) {
    // silent
  }
}

// ── Page Views ──────────────────────────────────────────
export function trackPageView(pageName, path) {
  trackEvent('page_view', { page_title: pageName, page_path: path });
}

// ── Business Events ─────────────────────────────────────
export function trackViewBusiness(businessName, businessId) {
  trackEvent('view_business', { business_name: businessName, business_id: businessId });
}

export function trackBusinessDirectorySearch(query) {
  trackEvent('search_businesses', { search_term: query });
}

export function trackBusinessDirectoryFilter(filter) {
  trackEvent('filter_businesses', { filter_type: filter });
}

// ── Event Events ────────────────────────────────────────
export function trackViewEvent(eventName, eventId) {
  trackEvent('view_event', { event_name: eventName, event_id: eventId });
}

// ── Map Events ──────────────────────────────────────────
export function trackMapInteraction(action, details = {}) {
  trackEvent('map_interaction', { action, ...details });
}

// ── Post / Forum Events ────────────────────────────────
export function trackCreatePost(postType) {
  trackEvent('create_post', { post_type: postType });
}

export function trackViewPost(postId) {
  trackEvent('view_post', { post_id: postId });
}

export function trackUpvote(contentType, contentId) {
  trackEvent('upvote', { content_type: contentType, content_id: contentId });
}

// ── Suggestion Events ──────────────────────────────────
export function trackCreateSuggestion() {
  trackEvent('create_suggestion');
}

export function trackViewSuggestion(suggestionId) {
  trackEvent('view_suggestion', { suggestion_id: suggestionId });
}

// ── Auth Events ─────────────────────────────────────────
export function trackSignUp(method) {
  trackEvent('sign_up', { method });
}

export function trackLogin(method) {
  trackEvent('login', { method });
}

// ── Share Events ────────────────────────────────────────
export function trackShare(contentType, contentId) {
  trackEvent('share', { content_type: contentType, content_id: contentId });
}

// ── Generic catch-all for one-off events ────────────────
export { trackEvent };

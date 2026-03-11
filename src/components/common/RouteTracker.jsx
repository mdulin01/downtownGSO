import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../utils/analytics';

const routeNames = {
  '/': 'Home',
  '/news': 'News',
  '/forum': 'Forum',
  '/feed': 'Forum',
  '/groups': 'Groups',
  '/ideas': 'Ideas',
  '/suggestions': 'Ideas',
  '/businesses': 'Businesses',
  '/events': 'Events',
  '/about': 'About',
  '/post/new': 'Create Post',
  '/suggestion/new': 'New Suggestion',
  '/admin': 'Admin',
  '/analytics': 'Analytics',
};

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const pageName = routeNames[location.pathname] || location.pathname;
    trackPageView(pageName, location.pathname);
  }, [location.pathname]);

  return null;
}

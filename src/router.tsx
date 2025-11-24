import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { RootLayout } from './routes/__root';
import { HomePage } from './routes/home';
import { PostDetailPage } from './routes/post-detail';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/$postId',
  component: PostDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, postDetailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface RouteContext {
    openLoginDialog?: () => void;
    openSignupDialog?: () => void;
  }
}

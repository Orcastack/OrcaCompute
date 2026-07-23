export type PortalVariant = 'standard' | 'home' | 'login' | 'cloud' | 'developer' | 'matrix';
export type PortalTarget = 'cloud' | 'developer' | 'matrix';

const publicPort = process.env.REACT_APP_PORTAL_PUBLIC_PORT || '3000';

function inferPortalVariantFromPathname(): PortalVariant | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const { pathname } = window.location;

  if (pathname === '/login') {
    return 'login';
  }
  if (pathname === '/cloud' || pathname.startsWith('/dashboard')) {
    return 'cloud';
  }
  if (pathname === '/developer' || pathname.startsWith('/developer/')) {
    return 'developer';
  }
  if (pathname === '/matrix' || pathname.startsWith('/matrix/')) {
    return 'matrix';
  }

  return null;
}

function inferPortalVariantFromQuery(): PortalVariant | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const portal = new URLSearchParams(window.location.search).get('portal');

  if (portal === 'home' || portal === 'login' || portal === 'cloud' || portal === 'developer' || portal === 'matrix') {
    return portal;
  }

  return null;
}

function inferPortalVariantFromHostname(): PortalVariant {
  if (typeof window === 'undefined') {
    return 'standard';
  }

  const pathnamePortalVariant = inferPortalVariantFromPathname();
  if (pathnamePortalVariant) {
    return pathnamePortalVariant;
  }

  const queryPortalVariant = inferPortalVariantFromQuery();
  if (queryPortalVariant) {
    return queryPortalVariant;
  }

  const hostname = window.location.hostname;

  if (hostname === 'login.localhost') {
    return 'login';
  }
  if (hostname === 'cloud.localhost') {
    return 'cloud';
  }
  if (hostname === 'developer.localhost') {
    return 'developer';
  }
  if (hostname === 'matrix.localhost') {
    return 'matrix';
  }
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'home';
  }

  return 'standard';
}

const configuredPortalVariant = (process.env.REACT_APP_PORTAL_VARIANT || 'standard') as PortalVariant;

function isLocalSingleHostMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function getLocalSingleHostBaseUrl(): string {
  if (typeof window === 'undefined') {
    return `http://localhost:${publicPort}`;
  }

  return window.location.origin;
}

export const portalVariant = configuredPortalVariant === 'standard'
  ? inferPortalVariantFromHostname()
  : configuredPortalVariant;

export const isMultiPortalVariant = portalVariant !== 'standard';

const singleHostBaseUrl = getLocalSingleHostBaseUrl();

export const portalHosts: Record<PortalTarget | 'home' | 'login', string> = isLocalSingleHostMode()
  ? {
      home: `${singleHostBaseUrl}/`,
      login: `${singleHostBaseUrl}/login`,
      cloud: `${singleHostBaseUrl}/cloud`,
      developer: `${singleHostBaseUrl}/developer`,
      matrix: `${singleHostBaseUrl}/matrix`,
    }
  : {
      home: `http://localhost:${publicPort}`,
      login: `http://login.localhost:${publicPort}`,
      cloud: `http://cloud.localhost:${publicPort}`,
      developer: `http://developer.localhost:${publicPort}`,
      matrix: `http://matrix.localhost:${publicPort}`,
    };

export const portalTargetLabels: Record<PortalTarget, string> = {
  cloud: 'Cloud Dashboard',
  developer: 'Developer Dashboard',
  matrix: 'Matrix Dashboard',
};

export const portalTargetPaths: Record<PortalTarget, string> = {
  cloud: '/dashboard',
  developer: '/developer/Dashboard',
  matrix: '/matrix',
};

export function resolvePortalTarget(value: string | null | undefined): PortalTarget {
  if (value === 'developer' || value === 'matrix') {
    return value;
  }
  return 'cloud';
}

export function getPortalTargetUrl(target: PortalTarget): string {
  if (isLocalSingleHostMode()) {
    return portalHosts[target];
  }

  return `${portalHosts[target]}${portalTargetPaths[target]}`;
}

export function getPortalLoginUrl(target?: PortalTarget): string {
  if (isLocalSingleHostMode()) {
    if (!target) {
      return portalHosts.login;
    }

    return `${portalHosts.login}?target=${target}`;
  }

  if (!target) {
    return portalHosts.login;
  }
  return `${portalHosts.login}/?target=${target}`;
}

export function getPortalPlan(target: PortalTarget): 'cloud' | 'developer' | 'enterprise' {
  if (target === 'developer') {
    return 'developer';
  }
  if (target === 'matrix') {
    return 'enterprise';
  }
  return 'cloud';
}

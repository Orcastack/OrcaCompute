export type PortalVariant = 'standard' | 'home' | 'login' | 'cloud' | 'developer' | 'matrix';
export type PortalTarget = 'cloud' | 'developer' | 'matrix';

const publicPort = process.env.REACT_APP_PORTAL_PUBLIC_PORT || '3000';

export const portalVariant = (process.env.REACT_APP_PORTAL_VARIANT || 'standard') as PortalVariant;

export const isMultiPortalVariant = portalVariant !== 'standard';

export const portalHosts: Record<PortalTarget | 'home' | 'login', string> = {
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
  return `${portalHosts[target]}${portalTargetPaths[target]}`;
}

export function getPortalLoginUrl(target?: PortalTarget): string {
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

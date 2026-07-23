import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { getPortalLoginUrl, getPortalPlan, getPortalTargetUrl, portalTargetLabels, PortalTarget, resolvePortalTarget } from '../portal/portalConfig';
import type { LoginRequest } from '../types/auth';
import { dashboardTokens } from '../styles/dashboardDesignSystem';

const demoAccount = {
  email: 'demo@example.com',
  password: 'password',
};

export default function PortalLoginPage() {
  const { login, user } = useAuth();
  const { actions } = useOnboarding();
  const [searchParams] = useSearchParams();
  const [target, setTarget] = useState<PortalTarget>(resolvePortalTarget(searchParams.get('target')));
  const [formData, setFormData] = useState<LoginRequest>(demoAccount);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destinationLabel = useMemo(() => portalTargetLabels[target], [target]);

  const redirectToTarget = (selectedTarget: PortalTarget) => {
    window.location.assign(getPortalTargetUrl(selectedTarget));
  };

  if (user) {
    redirectToTarget(target);
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(formData);
      actions.setUserPlan(getPortalPlan(target));
      actions.completeOnboarding();
      redirectToTarget(target);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: dashboardTokens.colors.background, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: 3 }}>
          <Paper sx={{ p: 4, borderRadius: 2, border: `1px solid ${dashboardTokens.colors.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: dashboardTokens.colors.textPrimary }}>
              Sign in to OrcaCompute
            </Typography>
            <Typography sx={{ mt: 1, color: dashboardTokens.colors.textSecondary }}>
              Authenticate once, then continue to the selected local dashboard service.
            </Typography>

            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Stack spacing={2}>
                <TextField
                  label="Destination"
                  select
                  value={target}
                  onChange={(event) => setTarget(resolvePortalTarget(event.target.value))}
                  helperText="Choose which dashboard this login should open."
                >
                  {Object.entries(portalTargetLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                />
                <Button type="submit" variant="contained" disabled={submitting} sx={{ textTransform: 'none', fontWeight: 700, py: 1.2 }}>
                  {submitting ? 'Signing in...' : `Sign in to ${destinationLabel}`}
                </Button>
              </Stack>
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 2, border: `1px solid ${dashboardTokens.colors.border}`, bgcolor: dashboardTokens.colors.surfaceSubtle, boxShadow: 'none' }}>
            <Typography sx={{ fontWeight: 700, color: dashboardTokens.colors.textPrimary }}>Local developer flow</Typography>
            <Typography sx={{ mt: 1.5, color: dashboardTokens.colors.textSecondary, lineHeight: 1.6 }}>
              This local login page defaults to the demo account so the multi-dashboard flow stays testable even when the backend auth API is offline.
            </Typography>
            <Stack spacing={1} sx={{ mt: 3 }}>
              <Typography sx={{ fontFamily: dashboardTokens.typography.fontFamily, color: dashboardTokens.colors.textPrimary }}>
                Email: {demoAccount.email}
              </Typography>
              <Typography sx={{ fontFamily: dashboardTokens.typography.fontFamily, color: dashboardTokens.colors.textPrimary }}>
                Password: {demoAccount.password}
              </Typography>
            </Stack>
            <Button href={getPortalLoginUrl()} sx={{ mt: 3, textTransform: 'none' }}>
              Reset target selection
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

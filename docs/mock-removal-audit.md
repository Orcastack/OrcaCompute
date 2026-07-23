# Mock Removal Audit

Initial production-path cleanup completed on 2026-07-23.

Removed

- webapp/src/data/mockData.ts
- Local demo and localStorage auth/signup fallbacks from webapp/src/services/authService.ts
- Mock analytics fallback generation from webapp/src/services/analyticsApi.ts
- Demo credential seeding from webapp/src/pages/PortalLoginPage.tsx
- Mock cloud overview route and hardcoded dashboard feed from webapp/src/pages/EnterpriseOverviewDashboard.tsx
- Hardcoded active-process feed from webapp/src/components/Layout/RightActivityPanel.tsx
- Local mock organization signup and registration from webapp/src/contexts/AuthContext.tsx
- Mock repository catalog and local import flow from webapp/src/pages/ProjectImportPage.tsx
- Unused mock community export from webapp/src/services/authService.ts

Confirmed remaining production-facing mock or placeholder surfaces

- webapp/src/services/environmentsApi.ts: multiple backend-404 fallbacks return mock environment data
- webapp/src/components/Enterprise/CompanyDashboard.tsx: inline mock data comment indicates non-live data path
- webapp/src/components/Enterprise/EnterpriseDocsModule.tsx: sample spaces/templates/pages are still embedded in production code
- webapp/src/components/Groups/GroupProjectCreateModal.tsx: local mock object is created on backend 501
- computeapi/services/monitoring/service.py: live monitoring falls back to mock data when agents are unavailable
- computeapi/services/kubernetes_integration/kube_monitor.py: kube monitor falls back to mock data when kubectl is unavailable
- computeapi/services/integrations/swift_service.py: storage operations fall back to mock responses
- computeapi/services/integrations/reseller_club_service.py: domain integration falls back to mock responses
- computeapi/services/pipelines/views.py: mock branch response remains
- computeapi/services/groups/viewsets.py: stubbed production resource aggregation remains

Out of scope for deletion-only pass

- Test suites under computeapi/services/tests that use unittest.mock or fake objects for verification
- Placeholder text in form inputs where the term means UX hint text, not fake runtime data

Recommended next slices

1. Remove mock environment fallbacks from the frontend services layer.
2. Audit enterprise documentation and company dashboard surfaces for embedded sample content.
3. Replace backend monitoring, storage, and domain mock fallbacks with explicit unavailable/error states.
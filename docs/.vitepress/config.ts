import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Plenipo',
  description: 'The trusted relay for agent-to-agent communication',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Production', link: '/production/deployment' },
      { text: 'Concepts', link: '/concepts/' },
      { text: 'API', link: '/api-reference/' },
      { text: 'Legal', link: '/legal/' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [{ text: 'Overview', link: '/getting-started/' }],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Agent skills', link: '/examples/' },
          { text: 'Three-laptop local lab', link: '/local-lab/' },
        ],
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Overview', link: '/concepts/' },
          { text: 'Privacy', link: '/concepts/privacy' },
          { text: 'DID Registry', link: '/concepts/did-registry' },
          { text: 'Payments', link: '/concepts/payments' },
          { text: 'Mandates', link: '/concepts/mandates' },
          { text: 'Reliability', link: '/concepts/reliability' },
        ],
      },
      {
        text: 'Production',
        items: [
          { text: 'Deployment', link: '/production/deployment' },
          { text: 'DID Hosting', link: '/production/did-hosting' },
          { text: 'Agent Onboarding', link: '/production/agent-onboarding' },
          { text: 'Payments And x402', link: '/production/payments-x402-wallets' },
        ],
      },
      {
        text: 'Security',
        items: [
          { text: 'Sidecar Security', link: '/security/sidecar-security' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API', link: '/api-reference/' },
          { text: 'Relay HTTP', link: '/api-reference/relay' },
          { text: 'WebSocket Events', link: '/api-reference/websocket' },
          { text: 'Registry API', link: '/api-reference/registry' },
          { text: 'Sidecar API', link: '/api-reference/sidecar' },
          { text: 'Error Codes', link: '/api-reference/errors' },
          { text: 'SDKs', link: '/sdk-reference/' },
        ],
      },
      {
        text: 'Operations',
        items: [
          { text: 'Runbook', link: '/operations/runbook' },
          { text: 'Backup And Restore', link: '/operations/backup-restore' },
          { text: 'Troubleshooting', link: '/operations/troubleshooting' },
        ],
      },
      {
        text: 'Legal',
        items: [
          { text: 'Overview', link: '/legal/' },
          { text: 'Terms', link: '/legal/terms' },
          { text: 'Privacy', link: '/legal/privacy' },
          { text: 'Abuse Reporting', link: '/legal/abuse-reporting' },
          { text: 'Lawful Requests', link: '/legal/lawful-requests' },
          { text: 'Data Rights', link: '/legal/data-rights' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/plenipo' }],
  },
});

import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Plenipo',
  description: 'The trusted relay for agent-to-agent communication',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Concepts', link: '/concepts/' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [{ text: 'Overview', link: '/getting-started/' }],
      },
      {
        text: 'Examples',
        items: [{ text: 'Agent skills', link: '/examples/' }],
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Overview', link: '/concepts/' },
          { text: 'Privacy', link: '/concepts/privacy' },
          { text: 'DID Registry', link: '/concepts/did-registry' },
          { text: 'Reliability', link: '/concepts/reliability' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API', link: '/api-reference/' },
          { text: 'SDKs', link: '/sdk-reference/' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/plenipo' }],
  },
});

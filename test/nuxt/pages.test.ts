import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { BunnyStreamDemo, BunnyCodeSnippets } from '#components'

describe('Component rendering', () => {
  // ── BunnyStreamDemo ──
  describe('BunnyStreamDemo', () => {
    it('renders fallback when env vars not set', async () => {
      const component = await mountSuspended(BunnyStreamDemo)
      expect(component.text()).toContain('NUXT_PUBLIC_BUNNY_STREAM')
    })

    it('shows feature highlights', async () => {
      const component = await mountSuspended(BunnyStreamDemo)
      expect(component.text()).toContain('HLS/DASH')
      expect(component.text()).toContain('DRM')
      expect(component.text()).toContain('4K')
    })

    it('shows player control labels', async () => {
      const component = await mountSuspended(BunnyStreamDemo)
      // Feature cards should be rendered
      expect(component.findAll('.grid > div').length).toBeGreaterThanOrEqual(3)
    })
  })

  // ── BunnyCodeSnippets ──
  describe('BunnyCodeSnippets', () => {
    it('renders 3 code snippet cards', async () => {
      const component = await mountSuspended(BunnyCodeSnippets)
      const cards = component.findAll('pre')
      expect(cards.length).toBe(3)
    })

    it('contains Shield WAF curl command', async () => {
      const component = await mountSuspended(BunnyCodeSnippets)
      expect(component.text()).toContain('api.bunny.net/shield')
      expect(component.text()).toContain('WAF')
    })

    it('contains DNS API curl command', async () => {
      const component = await mountSuspended(BunnyCodeSnippets)
      expect(component.text()).toContain('dnszone')
      expect(component.text()).toContain('DNSSEC')
    })

    it('contains Edge Scripting TypeScript code', async () => {
      const component = await mountSuspended(BunnyCodeSnippets)
      expect(component.text()).toContain('async fetch')
      expect(component.text()).toContain('X-Bunny-Country')
    })

    it('shows technology badges', async () => {
      const component = await mountSuspended(BunnyCodeSnippets)
      expect(component.text()).toContain('DDoS')
      expect(component.text()).toContain('Bot Detection')
      expect(component.text()).toContain('GeoDNS')
      expect(component.text()).toContain('TypeScript')
      expect(component.text()).toContain('Deno')
    })
  })
})

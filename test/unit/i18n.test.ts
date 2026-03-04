import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Recursively collect all leaf keys from a nested JSON object */
function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...collectKeys(obj[key] as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

function loadLocale(locale: string): Record<string, unknown> {
  const path = resolve(__dirname, '../../i18n/locales', `${locale}.json`)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

describe('i18n locale files', () => {
  const locales = ['en', 'th', 'zh'] as const
  const loaded = Object.fromEntries(locales.map(l => [l, loadLocale(l)]))

  it.each(locales)('%s.json is valid JSON with content', (locale) => {
    const data = loaded[locale]
    expect(data).toBeDefined()
    expect(typeof data).toBe('object')
    expect(Object.keys(data).length).toBeGreaterThan(0)
  })

  it('all locales have identical top-level keys', () => {
    const enKeys = Object.keys(loaded.en).sort()
    const thKeys = Object.keys(loaded.th).sort()
    const zhKeys = Object.keys(loaded.zh).sort()
    expect(thKeys).toEqual(enKeys)
    expect(zhKeys).toEqual(enKeys)
  })

  it('all locales have identical nested keys (no missing translations)', () => {
    const enKeys = collectKeys(loaded.en)
    const thKeys = collectKeys(loaded.th)
    const zhKeys = collectKeys(loaded.zh)

    const missingInTh = enKeys.filter(k => !thKeys.includes(k))
    const missingInZh = enKeys.filter(k => !zhKeys.includes(k))
    const extraInTh = thKeys.filter(k => !enKeys.includes(k))
    const extraInZh = zhKeys.filter(k => !enKeys.includes(k))

    expect(missingInTh, `Missing in TH: ${missingInTh.join(', ')}`).toEqual([])
    expect(missingInZh, `Missing in ZH: ${missingInZh.join(', ')}`).toEqual([])
    expect(extraInTh, `Extra in TH: ${extraInTh.join(', ')}`).toEqual([])
    expect(extraInZh, `Extra in ZH: ${extraInZh.join(', ')}`).toEqual([])
  })

  it('no locale contains empty string values', () => {
    for (const locale of locales) {
      const keys = collectKeys(loaded[locale])
      for (const key of keys) {
        const value = key.split('.').reduce((obj: Record<string, unknown> | undefined, k) => (obj as Record<string, unknown> | undefined)?.[k] as Record<string, unknown> | undefined, loaded[locale] as Record<string, unknown> | undefined)
        expect(value, `${locale}.${key} is empty`).not.toBe('')
      }
    }
  })
})

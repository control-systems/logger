import { describe, it, expect } from 'vitest'
import { Color, ColorCode } from './Color'

describe('Color Utility', () => {
  it('should create color formatters', () => {
    const formatter = Color.get(ColorCode.RED)
    expect(formatter).toBeDefined()
    expect(typeof formatter).toBe('function')

    const formattedText = formatter('test')
    expect(formattedText).toMatch(/\u001b\[31m.*\u001b\[39m/)
  })

  it('should handle color delimiter correctly', () => {
    const redDelimiter = Color.getDelimiter(ColorCode.RED)
    expect(redDelimiter).toBe(39)

    const boldDelimiter = Color.getDelimiter(ColorCode.BOLD)
    expect(boldDelimiter).toBe(22)
  })

  it('should merge color maps', () => {
    const map1 = new Map([['key1', ColorCode.RED]])
    const map2 = new Map([['key2', ColorCode.BLUE]])

    const mergedMap = Color.createFormatters(map2, map1)

    expect(mergedMap.size).toBe(2)
    expect(mergedMap.has('key1')).toBe(true)
    expect(mergedMap.has('key2')).toBe(true)
  })
})

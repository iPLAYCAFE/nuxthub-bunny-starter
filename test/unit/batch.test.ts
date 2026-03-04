import { describe, it, expect, vi } from 'vitest'
import { batchInsert } from '../../server/utils/batch'

describe('batchInsert', () => {
  it('processes empty array without calling insertFn', async () => {
    const insertFn = vi.fn()
    await batchInsert(insertFn, [])
    expect(insertFn).not.toHaveBeenCalled()
  })

  it('processes items smaller than batch size in a single call', async () => {
    const insertFn = vi.fn()
    const items = [1, 2, 3]
    await batchInsert(insertFn, items, 50)
    expect(insertFn).toHaveBeenCalledTimes(1)
    expect(insertFn).toHaveBeenCalledWith([1, 2, 3])
  })

  it('splits items into correct batch sizes', async () => {
    const insertFn = vi.fn()
    const items = [1, 2, 3, 4, 5]
    await batchInsert(insertFn, items, 2)
    expect(insertFn).toHaveBeenCalledTimes(3)
    expect(insertFn).toHaveBeenNthCalledWith(1, [1, 2])
    expect(insertFn).toHaveBeenNthCalledWith(2, [3, 4])
    expect(insertFn).toHaveBeenNthCalledWith(3, [5])
  })

  it('defaults to batch size of 50', async () => {
    const insertFn = vi.fn()
    const items = Array.from({ length: 120 }, (_, i) => i)
    await batchInsert(insertFn, items)
    expect(insertFn).toHaveBeenCalledTimes(3) // 50 + 50 + 20
  })

  it('calls insertFn sequentially (not in parallel)', async () => {
    const order: number[] = []
    const insertFn = vi.fn(async (batch: number[]) => {
      await new Promise(r => setTimeout(r, 10))
      order.push(batch[0])
    })
    await batchInsert(insertFn, [1, 2, 3], 1)
    expect(order).toEqual([1, 2, 3])
  })
})

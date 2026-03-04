/**
 * Execute inserts in batches of configurable size.
 * SQLite performs best with 20–50 rows per transaction.
 *
 * @example
 * ```ts
 * await batchInsert(
 *   (batch) => db.insert(tables.visitors).values(batch),
 *   visitors,
 *   50
 * )
 * ```
 */
export async function batchInsert<T>(
  insertFn: (batch: T[]) => Promise<unknown>,
  items: T[],
  batchSize = 50
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    await insertFn(items.slice(i, i + batchSize))
  }
}

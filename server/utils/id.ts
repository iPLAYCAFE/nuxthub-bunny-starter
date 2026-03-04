// id.ts — shared ID generation utilities
// UUIDv7: internal primary keys (time-ordered, analytics-friendly)
// Nano ID: public-facing slugs and secrets (URL-safe, no timestamp leak)

import { v7 as uuidv7 } from 'uuid'
import { nanoid } from 'nanoid'

/** New UUIDv7 primary key (RFC 9562) */
export const newPk = () => uuidv7()

/** New Nano ID slug — 21 chars, URL-safe, CSPRNG */
export const newSlug = () => nanoid(21)

/** New Nano ID secret — 48 chars, 288-bit entropy (API keys, reset tokens) */
export const newKey = () => nanoid(48)

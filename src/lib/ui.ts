/**
 * Nova Analytics — UI primitives.
 *
 * Single re-export point for the dashboard's React component primitives
 * (Button, Form, Heading, Row, Column, Table, Toast, etc.). All app code
 * imports from `@/lib/ui` instead of the underlying library so the surface
 * area is one place to change if we ever swap UI libraries.
 */

// biome-ignore lint/performance/noBarrelFile: intentional re-export barrel
// eslint-disable-next-line no-restricted-imports
export * from '@umami/react-zen';

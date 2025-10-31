/**
 * @packageDocumentation
 * The Crucible UI Reconciler package defines the bridge between React’s
 * reconciliation algorithm and Crucible’s rendering engine. It provides the
 * necessary configuration for React to manage Crucible UI components within
 * the React Fiber architecture. This package does not perform any rendering
 * itself. It delegates all host-specific operations to a given renderer
 * implementation defined in the `core` package.
 */

export * from './components';
export * from './Reconciler';
export type * from './Renderer';

/**
 * @packageDocumentation
 * @module crucible-ui
 *
 * The root entry point of the Crucible UI framework.
 *
 * This module re-exports the public surface of `crucible-ui`, which defines
 * Crucible’s declarative component system.
 *
 * Crucible UI extends React’s reconciliation model with its own runtime element
 * format, reconciler implementation, and component abstraction layer. While
 * React remains responsible for scheduling, diffing, and reconciliation
 * orchestration, Crucible replaces React’s rendering pipeline with its own
 * component model.
 *
 * Crucible introduces an intermediate metadata layer that associates each JSX
 * element with its corresponding Crucible component constructor. This enables
 * Crucible’s reconciler to instantiate and manage components independently of
 * React’s internal component resolution.
 *
 * The Crucible UI architecture is divided into two conceptual layers:
 *
 * 1. Elements are immutable data objects that describe the intended component
 *    hierarchy, properties, and children. Elements are created by the JSX
 *    factory and interpreted by the Crucible reconciler.
 *
 * 2. Components are executable entities that encapsulate state, logic, and
 *    lifecycle management. Components are instantiated by the reconciler based
 *    on the structure described by their corresponding elements.
 *
 * Crucible UI defines its own JSX factory, {@link crucible-ui.createElement},
 * which is automatically invoked during JSX compilation. The build system
 * rewrites all JSX expressions to use the injected alias {@link
 * __Crucible_createElement} instead of React’s `createElement`.
 *
 * This indirection allows Crucible to enrich element objects with additional
 * metadata, ensuring compatibility with its custom reconciler and rendering
 * infrastructure. The injected metadata includes a reference to the original
 * component constructor under the internal `__crucible_ctor` property.
 *
 * Crucible UI components extend the {@link Component} base class, which
 * defines the common lifecycle structure for all Crucible widgets. Components
 * declare their configuration through interfaces extending {@link ComponentProps},
 * and manage runtime state through {@link ComponentState}.
 */
export * from "./crucible-ui";

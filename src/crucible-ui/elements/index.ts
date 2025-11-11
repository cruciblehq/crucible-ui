/**
 * @packageDocumentation
 * @module crucible-ui/core/elements
 *
 * Defines the foundational element model for Crucible UI.
 *
 * Elements describe the representation of intents as React-compatible element
 * objects. This module provides the canonical type definitions, intrinsic
 * element declarations, and creation factories used throughout the Crucible
 * runtime and platform renderers.
 *
 * All JSX emitted is lowered into element objects defined by this module.
 * These objects encapsulate intent metadata, constructor references, and
 * Crucible-specific properties required by the custom reconciler.
 * 
 * Each Crucible element embeds a reference to its original intent constructor
 * through the internal `__crucible_ctor` property. This injection is performed
 * automatically by the element factory to preserve the link between the
 * React-facing element type (a string) and the actual Crucible class
 * constructor required by the custom reconciler.
 * 
 * This module exports a mangled JSX factory alias {@link __Crucible_createElement},
 * which the build system injects automatically during JSX transformation. This
 * alias replaces {@link createElement} in compiled widget code, enabling
 * Crucible to generate element objects with embedded metadata (`__crucible_ctor`)
 * and full compatibility with the Crucible reconciler.
 */
export type * from './Element';
export type * from './intrinsics';
export * from './Composite';
export * from './factories';

/**
 * @packageDocumentation
 * @module crucible-ui/core/components/interface
 * 
 * This module defines the logic related to Crucible UI's interaction with the
 * host environment, specifically the interfaces for native platform integrations.
 * 
 * {@link Renderer} and {@link Host} define the contracts required to implement
 * a Crucible UI renderer for a specific platform (e.g., web, native). Hosts
 * must also provide a {@link Manifest} that describes the widgets to render.
 */
export type * from "./Context";
export type * from "./intrinsics";
export type * from "./Manifest";
export type * from "./Ref";
export type * from "./Renderer";
export * from "./Host";

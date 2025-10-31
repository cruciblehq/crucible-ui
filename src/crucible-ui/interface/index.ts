/**
 * @packageDocumentation
 * @module crucible-ui/core/components/interface
 * 
 * This module defines interfaces related to the Crucible UI component
 * interaction with the host environment, specifically {@link API}.
 * 
 * Crucible UI widgets operate within a SES sandbox for security and isolation.
 * The {@link API} interface defines the allowed methods for components to
 * interact with the host environment, bypassing the SES restrictions in a
 * controlled manner.
 */
export type * from "./API";

/**
 * Represents the base structure for all events in Crucible UI.
 *
 * This interface serves as the root of the event hierarchy. It defines the
 * minimal contract for event objects dispatched by the component layer.
 * Specific event types extend this interface to include context-specific data
 * (e.g., input coordinates, target references, etc).
 */
export interface Event { }

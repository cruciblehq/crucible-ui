import type { Event } from './Event';

/**
 * Represents a trigger event in Crucible UI.
 *
 * This event is triggered when the user activates a pressable element, such as
 * a button or touchable component, through an input action like a click, tap,
 * or keypress. It may also be activated programmatically or through external
 * input sources.
 */
export interface TriggerEvent extends Event { }

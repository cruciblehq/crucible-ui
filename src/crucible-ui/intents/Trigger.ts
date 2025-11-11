import type { TriggerEvent } from "../events";
import {
    Intent,
    type IntentProps,
    type IntentState
} from "./Intent";

/**
 * Defines the properties accepted by the {@link Trigger} intent.
 *
 * A {@link Intent} represents an interactive control that responds to user
 * input, typically used to trigger actions.
 */
export interface TriggerProps extends IntentProps {

    /**
     * Called when the trigger is activated.
     *
     * The event object provides contextual details about the interaction,
     * such as the input source. The handler must execute synchronously within
     * the component’s update cycle to ensure predictable interaction behavior.
     *
     * @param e The event representing the press interaction.
     */
    readonly onTriggered?: (e: TriggerEvent) => void;
}

/**
 * Represents the internal state maintained by a {@link Trigger} component.
 */
export interface TriggerState extends IntentState { }

/**
 * The {@link Trigger} component defines an interactive pressable component.
 *
 * Triggers are pressable UI elements that users can interact with to perform
 * actions. They emit press-related events and can contain textual content.
 *
 * @typeParam TriggerProps - The property type defining inputs accepted by
 *                          the component.
 * @typeParam TriggerState - The state type maintained internally by
 *                          the component.
 */
export class Trigger extends Intent<TriggerProps, TriggerState> { }

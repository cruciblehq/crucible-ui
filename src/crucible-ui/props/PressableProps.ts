import { type PressEvent } from "../events";

/**
 * Defines the properties accepted by {@link Pressable} components.
 */
export interface PressableProps {

    /**
     * Called when the component is pressed or activated by the user.
     *
     * The event object provides contextual details about the interaction,
     * such as the input source. The handler must execute synchronously within
     * the component’s update cycle to ensure predictable interaction behavior.
     *
     * @param e The event representing the press interaction.
     */
    readonly onPress?: (e: PressEvent) => void;
}

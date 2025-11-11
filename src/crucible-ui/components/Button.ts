import { type PressableProps } from "../props";
import {
    Content,
    type ContentProps,
    type ContentState
} from "./Content";

/**
 * Defines the properties accepted by the {@link Button} component.
 *
 * A {@link Button} represents an interactive control that responds to user
 * input, typically used to trigger actions. It extends {@link PressableProps}
 * and {@link ContentProps}, inheriting all properties related to press
 * interactions, content, and accessibility.
 */
export interface ButtonProps extends ContentProps, PressableProps { }

/**
 * Represents the internal state maintained by a {@link Button} component.
 */
export interface ButtonState extends ContentState { }

/**
 * The {@link Button} component defines an interactive pressable component.
 *
 * Buttons are pressable UI elements that users can interact with to perform
 * actions. They emit press-related events and can contain textual content.
 *
 * @typeParam ButtonProps - The property type defining inputs accepted by
 *                          the component.
 * @typeParam ButtonState - The state type maintained internally by
 *                          the component.
 */
export class Button extends Content<ButtonProps, ButtonState> {

    /**
     * Initializes a new instance of the {@link Button} component.
     *
     * @param props - The properties used to configure the component.
     */
    constructor(props: ButtonProps) {
        super(props);
    }
}

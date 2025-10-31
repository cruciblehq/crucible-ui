import { type PressableProps } from "../props";
import {
    Component,
    type ComponentProps,
    type ComponentState
} from "./Component";

/**
 * Defines the properties accepted by the {@link Button} component.
 *
 * A {@link Button} represents an interactive control that responds to user
 * input, typically used to trigger actions. It extends {@link PressableProps},
 * inheriting all properties related to press interactions and accessibility.
 */
export interface ButtonProps extends ComponentProps, PressableProps {
}

/**
 * Represents the internal state maintained by a {@link Button} component.
 *
 * Buttons extend {@link PressableState}, which tracks press interaction
 * state such as hover, focus, and active states. Implementations may extend
 * this interface to include visual or behavioral state.
 */
export interface ButtonState extends ComponentState { }

/**
 * The {@link Button} component defines an interactive pressable component.
 *
 * Buttons serve as higher-level abstractions over {@link Pressable}, adding
 * semantic meaning and potentially style or behavior specific to button-like
 * controls. They emit press-related events and can contain child components
 * such as text or icons.
 *
 * @typeParam ButtonProps - The property type defining inputs accepted by the component.
 * @typeParam ButtonState - The state type maintained internally by the component.
 */
export class Button extends Component<ButtonProps, ButtonState> { }

import {
    Component,
    type ComponentProps,
    type ComponentState,
} from "./Component";
import type {
    InputType,
    BaseInputProps,
} from "../props";

/**
 * Props for the {@link Input} component.
 *
 * Represents the interface of Crucible’s input component props. `InputProps`
 * extends the core {@link ComponentProps} with input props derived from {@link
 * BaseInputProps}. This enables the same component to represent different input
 * types, depending on the declared {@link InputType}.
 * 
 * Input types do not enforce validation rules; they serve as rendering
 * hints to guide how the input should behave and appear to the user.
 * 
 * Accepts UTF-8 encoded characters except control characters.
 * 
 * @see {@link InputType}
 * @see {@link BaseInputProps}
 */
export interface InputProps extends ComponentProps, BaseInputProps {

    /**
     * The type of input control to render.
     *
     * Determines how the component behaves and appears. Supported values are
     * defined by {@link InputType}.
     */
    readonly type: InputType;

    /**
     * The current value of the input.
     *
     * Represents the string form of the input’s content. All input variants
     * use a string representation for their internal state, regardless of
     * logical data type.
     */
    readonly value?: string;
}

/**
 * State for the {@link Input} component.
 *
 * Represents the internal runtime state of the component. This base state
 * does not define any specific fields but serves as an extension point for
 * specialized inputs that need to track transient data, such as focus state,
 * cursor position, or validation results.
 */
export interface InputState extends ComponentState { }

/**
 * Base class for Crucible UI input components.
 *
 * The {@link Input} component defines components that handle user input. It
 * can represent multiple input modes (e.g., text, numeric, etc) depending on
 * its {@link InputProps.type} value. The component itself defines no rendering
 * logic; platform renderers interpret its props to produce the appropriate
 * native control.
 *
 * @typeParam PropsT - The props type extending {@link InputProps}.
 * @typeParam StateT - The state type extending {@link InputState}.
 */
export class Input<
    PropsT extends InputProps = InputProps,
    StateT extends InputState = InputState
> extends Component<PropsT, StateT> { }

import {
    Intent,
    type IntentProps,
    type IntentState,
} from "./Intent";

/**
 * Defines the set of supported input types.
 *
 * Each type corresponds to a specific rendering behavior. For example, a `text`
 * input may be rendered as a text box, while a `number` input may be rendered
 * with numeric controls, a slider, spinner, etc, depending on configurations
 * determined at the composition layer.
 * 
 * Input types do not enforce validation rules; they serve as rendering hints
 * to guide how the input should behave and appear to the user.
 */
export type InputType =
    | "text"
    | "password"
    | "number";

/**
 * Props for the {@link Input} intent.
 *
 * Enables the same intent to represent different input types, depending on the
 * declared {@link InputType}.
 * 
 * Input types do not enforce validation rules; they serve as rendering hints
 * to guide how the input should behave and appear to the user.
 * 
 * @see {@link InputType}
 * @see {@link BaseInputProps}
 */
export interface InputProps extends IntentProps {

    /**
     * The type of input control.
     *
     * Determines the specific input behavior and rendering mode, such as
     * `text`, `password`, or `number`. Each type corresponds to a specific
     * set of props and behaviors and may influence how the input is presented
     * to the user. For example, a `password` input masks entered characters
     * when rendered as a text box, while a `number` input may provide numeric
     * controls, a slider, spinner, etc, depending on configurations determined
     * at composition time.
     * 
     * Input types do not enforce validation rules; they serve as rendering
     * hints to guide how the input should behave and appear to the user.
     */
    readonly type: InputType;

    /**
     * The content of the input field.
     *
     * Represents the textual value associated with the control. Must accept
     * a string representation of the input data, regardless of the specific
     * input type. For example, numeric inputs should convert numeric values
     * to and from their string representation for this field.
     * 
     * Accepts UTF-8 encoded characters except control characters.
     */
    readonly value?: string;
}

/**
 * State for the {@link Input} intent.
 */
export interface InputState extends IntentState { }

/**
 * Base class for Crucible UI input intents.
 *
 * The {@link Input} intent defines intents that handle user input. It
 * can represent multiple input modes (e.g., text, numeric, etc) depending on
 * its {@link InputProps.type} value. The intent itself defines no rendering
 * logic; platform renderers interpret its props to produce the appropriate
 * native control.
 *
 * @typeParam PropsT - The props type extending {@link InputProps}.
 * @typeParam StateT - The state type extending {@link InputState}.
 */
export class Input<
    PropsT extends InputProps = InputProps,
    StateT extends InputState = InputState
> extends Intent<PropsT, StateT> { }

/**
 * Defines the set of supported input types.
 *
 * Each type corresponds to a specific rendering behavior. The `type` field in
 * {@link BaseInputProps} determines which variant of input is represented,
 * impacting both behavior and appearance. For example, a `"password"` input
 * should mask characters, while a `"number"` input may be rendered with numeric
 * controls, a slider, spinner, etc, depending on configurations determined at
 * composition time.
 * 
 * Input types do not enforce validation rules; they serve as rendering hints
 * to guide how the input should behave and appear to the user.
 */
export type InputType =
    | "text"
    | "password"
    | "number";

/**
 * Base props for all input components.
 *
 * @typeParam T - The concrete input type.
 */
export interface BaseInputProps {

    /**
     * The type of input control.
     *
     * Determines the specific input behavior and rendering mode, such as
     * `"text"`, `"password"`, or `"number"`. Each type corresponds to a
     * specific set of props and behaviors and may influence how the input
     * is presented to the user. For example, a `"password"` input masks
     * entered characters, while a `"number"` input may provide numeric
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

import {
    Component,
    type ComponentProps,
    type ComponentState
} from './Component';

/**
 * Props for the {@link Text} component.
 *
 * Represents textual content rendered as part of the component tree. Text nodes
 * in Crucible UI are modeled as components rather than raw strings, allowing
 * them to participate in the reconciliation and rendering process and receiving
 * props, state, refs, and lifecycle events like other components.
 */
export interface TextProps extends ComponentProps {

    /**
     * The textual content to display.
     *
     * Represents the raw, literal text value managed by this component. Unlike
     * rich text or markup-based systems, the content is treated strictly as
     * plain text and is not parsed for formatting or embedded markup.  
     *
     * Native renderers are responsible for validating the content according to
     * platform-specific conventions. For example, a web renderer may need to
     * escape HTML entities to prevent injection.
     *
     * By default, whitespace handling follows the same principles defined by
     * the HTML standard for text nodes:
     *
     * - Consecutive spaces and tabs are collapsed into a single space.
     * - Newline (`\n`) and carriage return (`\r`) characters are treated as
     *   single spaces unless explicitly preserved by renderer configuration.
     * - Leading and trailing whitespace is not rendered.
     *
     * Future revisions may allow explicit control of whitespace behavior through
     * configuration props (e.g., `whiteSpace: 'pre'`).
     *
     * Accepts any valid UTF-8 text. Control characters other than tab (\t),
     * line feed (\n), and carriage return (\r) are non-renderable and may be
     * ignored or replaced by the renderer.
     */
    readonly content: string;
}

/**
 * State for the {@link Text} component.
 *
 * Text components typically have no internal state, so this interface exists
 * primarily to fulfill the generic type requirements of {@link Component}.
 */
export interface TextState extends ComponentState { }

/**
 * Represents a textual component in Crucible UI.
 *
 * The {@link Text} component encapsulates a text node within the Crucible
 * component hierarchy. 
 */
export class Text extends Component<TextProps, TextState> { }

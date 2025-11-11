import {
    type ComponentProps,
    type ComponentState,
    Component,
} from "./Component";

/**
 * Defines the properties accepted by content components.
 */
export interface ContentProps extends ComponentProps {

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
     * Whitespace handling follows the same principles defined by the HTML
     * standard for text nodes:
     *
     * - Consecutive spaces and tabs are collapsed into a single space.
     * - Newline (`\n`) and carriage return (`\r`) characters are treated as
     *   single spaces unless explicitly preserved by renderer configuration.
     * - Leading and trailing whitespace is not rendered.
     *
     * Accepts any valid UTF-8 text. Control characters other than tab (\t),
     * line feed (\n), and carriage return (\r) are non-renderable and may be
     * ignored or replaced by the renderer.
     */
    content?: string;
}

/**
 * Represents the internal state of a content component.
 *
 * Content components generally have minimal or no internal state. This
 * interface extends {@link ComponentState} for consistency across the
 * component model.
 */
export interface ContentState extends ComponentState { }

export abstract class Content<
    PropsT extends ContentProps = ContentProps,
    StateT extends ContentState = ContentState
> extends Component<PropsT, StateT> {

    constructor(props: PropsT) {
        super(props);
    }

    get content(): string {
        return this.props.content ?? "";
    }
}

/**
 * Defines the constructor signature for an abstract content component type.
 *
 * Represents a class that extends {@link Content}, parameterized by its props
 * and state types. It is abstract and not directly instantiable, and is used in
 * contexts where a content component class is required without needing to
 * create an instance.
 *
 * @typeParam ContentPropsT - The type of the props accepted by the content.
 * @typeParam ContentStateT - The type of the state maintained by the content.
 */
export type ContentType<
    ContentPropsT extends ContentProps = ContentProps,
    ContentStateT extends ContentState = ContentState
> = abstract new (
    props: ContentPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Content<ContentPropsT, ContentStateT>;

/**
 * Defines the constructor signature for a concrete content component type.
 *
 * Represents a non-abstract subclass of {@link Content} that can be directly
 * instantiated. Used in contexts where a specific content component class is
 * required, such as factory registration or element creation.
 *
 * @typeParam ContentPropsT - The type of the props accepted by the content.
 * @typeParam ContentStateT - The type of the state maintained by the content.
 */
export type ConcreteContentType<
    ContentPropsT extends ContentProps = ContentProps,
    ContentStateT extends ContentState = ContentState
> = new (
    props: ContentPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Content<ContentPropsT, ContentStateT>;

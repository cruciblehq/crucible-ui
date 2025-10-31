import {
    Component,
    type ComponentProps,
    type ComponentState
} from "./Component";

/**
 * Properties for the Content component, which holds structured text content.
 * The content may include markup or other formatting elements, depending on
 * the rendering context. This interface extends ComponentProps and adds an
 * optional 'children' property to hold the text content.
 */
export interface ContentProps extends ComponentProps {

    /**
     * The initial textual content, used only when the Content component is
     * first being rendered. If not provided, the initial content defaults to
     * an empty string. This string may include markup or other structural
     * elements, depending on the context in which the Content component is
     * used. It is the responsibility of the renderer to interpret and render
     * this content appropriately. It is not sanitized or escaped; care must
     * be taken to avoid security issues such as XSS when rendering this
     * content in environments like the web.
     * 
     * @note This property is named 'children' to align with React's handling of
     * text content in JSX. When using JSX, text nodes within a Content
     * component are passed as the 'children' prop.
     */
    children?: string;
}

/**
 * State interface for the Content component. Defines the state properties that
 * are specific to Content components, such as selection range and focus state.
 * This interface extends ComponentState to include additional properties
 * relevant to content handling.
 */
export interface ContentState extends ComponentState {

    /**
     * The current textual content of the Content component. This string
     * represents the structured markup text that the component holds. It may
     * include formatting and structural elements, depending on the rendering
     * context. The content can be updated over time, and it is the
     * responsibility of the renderer to interpret and display this content
     * correctly. Like the initial content in props, this string is not
     * sanitized or escaped, so care must be taken to avoid security issues
     * when rendering it in environments like the web.
     */
    content: string;
}

/**
 * A Content component holds plain text content meant to represent structured
 * markup text (e.g., paragraphs, headings, lists). It is used to encapsulate
 * text content that may include formatting and structure, as opposed to simple
 * inline text. The specific schema and parsing of the content is determined by
 * the rendering engine or platform, usually in a way that supports rich text
 * features. For example, in a web context, the content is probably HTML. Once
 * within the context of a Content component, the text is treated as a block of
 * structured content, allowing for more complex rendering and interaction than
 * plain text nodes. Other Components are not allowed to be children of a
 * Content component; only text content is valid.
 */
export class Content extends Component<ContentProps, ContentState> {

    /**
     * Indicates that this component represents structured content, allowing
     * rich markup text. This static property is used for type checking and
     * identification of Content components.
     */
    static readonly isContent = true;

    /**
     * Default properties for the Content component.
     */
    static readonly defaultProps: ContentProps = {
        children: "",
    };

    /**
     * Constructs a new Content component with the given properties. Initializes
     * the state based on the provided props. The initial content is taken from
     * props.children, defaulting to an empty string if not provided.
     * 
     * @param props The properties for the Content component.
     */
    constructor(props: ContentProps) {
        super(props);

        // Initialize state with the initial content from props
        this.state = {
            content: props.children ?? "",
        };
    }

    /**
     * Sets new content for the Content component. This method updates the
     * internal state with the provided content string, which may include
     * structured markup text. The renderer is responsible for interpreting
     * and displaying this content appropriately.
     * 
     * @param newContent The new content string to set.
     */
    setContent(newContent: string): void {
        this.setState({ content: newContent });
    }

    /**
     * Gets the current content of the Content component. This method returns
     * the string representing the structured markup text currently held by
     * the component.
     * 
     * @returns The current content string.
     */
    get content(): string {
        return this.state.content;
    }
}

/**
 * Type guard to check if a component is a Content component, based on the
 * static isContent property of its class.
 * 
 * @param component The component to check.
 * @returns True if the component is a Content component, false otherwise.
 */
export function isContent(
    component: Component<ComponentProps, ComponentState>
): component is Content {
    const ctor = component.constructor as Partial<typeof Content>;
    return ctor.isContent === true;
}

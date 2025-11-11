import { Content, type ContentProps, type ContentState } from './Content';

/**
 * Props for the {@link Text} component.
 */
export interface TextProps extends ContentProps { }

/**
 * State for the {@link Text} component.
 */
export interface TextState extends ContentState { }

/**
 * Represents a textual component in Crucible UI.
 *
 * Represents textual content rendered as part of the component tree. Text
 * nodes are modeled as components rather than raw strings, allowing them to
 * participate in the reconciliation and rendering process and receiving props,
 * state, refs, and lifecycle events like other components.
 */
export class Text extends Content<TextProps, TextState> { }

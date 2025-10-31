import type { LayoutProps } from "../props/LayoutProps";
import {
    Container,
    type ContainerProps,
    type ContainerState
} from "./Container";

/**
 * Defines the properties accepted by the {@link View} component.
 * 
 * A View represents a layout container in Crucible UI, used to group and
 * organize other components visually or structurally. It extends
 * {@link ContainerProps}, inheriting all standard container properties.
 */
export interface ViewProps extends ContainerProps, LayoutProps { }

/**
 * Represents the internal state maintained by a {@link View} component.
 * 
 * Views generally have minimal state; this interface extends
 * {@link ContainerState} to allow for layout- or rendering-related state
 * as required by the renderer implementation.
 */
export interface ViewState extends ContainerState { }

/**
 * The {@link View} component defines a layout container in Crucible UI.
 * 
 * Views are structural primitives designed to contain and arrange child
 * components. They serve as the fundamental building blocks of layouts
 * in Crucible-based interfaces. A View inherits all behavior from
 * {@link Container}, including child management and rendering delegation.
 *
 * @typeParam ViewProps - The property type defining inputs accepted by the component.
 * @typeParam ViewState - The state type maintained internally by the component.
 */
export class View extends Container<ViewProps, ViewState> { }

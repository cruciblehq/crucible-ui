import {
    type IntentProps,
    type IntentState,
    Intent,
} from "./Intent";

/**
 * Defines props controlling how child intents are distributed along the main
 * axis of a layout container.
 *
 * These props correspond to the horizontal or vertical alignment of children,
 * depending on the container’s content direction. They determine how available
 * space is shared between and around children.
 */
export interface LayoutJustifyProps {
    readonly justify?:
    | "start"
    | "end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
}

/**
 * Defines props controlling how child intents are aligned along the cross
 * axis of a layout container.
 *
 * These props correspond to the perpendicular alignment of children
 * relative to the main axis. For example, in a horizontal layout, alignment
 * occurs vertically.
 */
export interface LayoutAlignProps {
    readonly align?:
    | "start"
    | "end"
    | "center"
    | "stretch"
    | "baseline";
}

/**
 * Defines props that control the direction of content within a layout container.
 *
 * This determines the primary axis along which children are arranged. `row`
 * layouts arrange children horizontally, while `column` layouts arrange them
 * vertically.
 */
export interface LayoutContentDirectionProps {
    readonly contentDirection?:
    | "row"
    | "column";
}

/**
 * Defines the properties accepted by layout intents.
 * 
 * Layout props determine how children are diplaced, aligned, and justified,
 * within a layout container. They define the structural behavior of content
 * rather than its appearance.
 *
 * Crucible’s layout model is inspired by CSS Flexbox but intentionally
 * simpler. It omits features such as grid layouts and flex grow/shrink
 * to maintain a straightforward and predictable layout system.
 */
export interface LayoutProps extends
    IntentProps,
    LayoutJustifyProps,
    LayoutAlignProps,
    LayoutContentDirectionProps { }

/**
 * Represents the internal state of a layout intent.
 */
export interface LayoutState extends IntentState { }

/**
 * Layout intents in Crucible UI.
 *
 * A layout defines structural composition and provides methods to manage
 * child components.
 *
 * @typeParam PropsT - The property type accepted by the layout.
 * @typeParam StateT - The state type maintained by the layout.
 */
export class Layout<
    PropsT extends LayoutProps = LayoutProps,
    StateT extends LayoutState = LayoutState
> extends Intent<PropsT, StateT> {

    /**
     * The child intents contained within this layout.
     */
    readonly #children: Intent[];

    /**
     * Constructs a new {@link Layout} instance.
     *
     * @param props - The immutable props object that defines the layout.
     */
    constructor(props: PropsT) {
        super(props);
        this.#children = [];
    }

    /**
     * Appends a child intent to the layout container.
     *
     * @param child The child intent to append.
     */
    appendChild(child: Intent): void {
        this.#children.push(child);
    }
}

/**
 * Defines the constructor signature for a layout intent type.
 *
 * This type represents a layout class that can be instantiated, typically
 * used in the rendering pipeline or by the reconciler when constructing
 * live component instances.
 *
 * @typeParam LayoutPropsT - The type of the props accepted by the component.
 * @typeParam LayoutStateT - The type of the internal state maintained by the
 *                              layout.
 *
 * @param props - The props used to initialize the layout.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type LayoutType<
    LayoutPropsT extends LayoutProps = LayoutProps,
    LayoutStateT extends LayoutState = LayoutState
> = new (
    props: LayoutPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Layout<LayoutPropsT, LayoutStateT>;

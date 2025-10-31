/**
 * Defines props controlling how child components are distributed along the
 * main layout axis of a container.
 *
 * These props correspond to the horizontal or vertical alignment of children,
 * depending on the container’s content direction. They determine how available
 * space is shared between and around children. The following illustrations
 * depict each justification mode in a horizontal layout context:
 * 
 * |■■■        | - `start`
 * |        ■■■| - `end`
 * |    ■■■    | - `center`
 * |■    ■    ■| - `space-between`
 * | ■   ■   ■ | - `space-around`
 * |  ■  ■  ■  | - `space-evenly`
 */
export interface JustifyProps {
    readonly justify?:
    | "start"
    | "end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
}

/**
 * Defines props controlling how child components are aligned along the cross
 * axis of a container.
 *
 * These props correspond to the perpendicular alignment of children
 * relative to the main axis. For example, in a horizontal layout, alignment
 * occurs vertically.
 */
export interface AlignProps {
    readonly align?:
    | "start"
    | "end"
    | "center"
    | "stretch"
    | "baseline";
}

/**
 * Enumerates supported overflow handling strategies for container content.
 *
 * These strategies specify how a container manages content that extends
 * beyond its bounds.
 */
export type OverflowType =
    | "visible" // Content exceeds boundaries without clipping
    | "hidden"  // Content beyond boundaries is clipped
    | "break"   // Content wraps to the next line or column
    | "scroll"  // Scrollbars are shown as needed
    | "auto";   // Scrollbars appear only when necessary

/**
 * Defines props that control overflow behavior within containers.
 *
 * Containers can apply overflow rules globally or separately for each axis,
 * with `overflow` applying to both main and cross axes and `overflowMain` and
 * `overflowCross` applying to their respective axes. If both are set, the
 * latter take precedence over the general `overflow` prop.
 */
export interface OverflowProps {
    readonly overflow?: OverflowType;
    readonly overflowMain?: OverflowType;
    readonly overflowCross?: OverflowType;
}

/**
 * Defines props that control the direction of content layout within a container.
 *
 * This determines the primary axis along which children are arranged. `row`
 * layouts arrange children horizontally, while `column` layouts arrange them
 * vertically.
 */
export interface ContentDirectionProps {
    readonly contentDirection?:
    | "row"
    | "column";
}

/**
 * Groups layout-related props used by Crucible containers.
 *
 * Layout props determine how children are aligned, justified,
 * and how overflow is handled within a container. They define the
 * structural behavior of content rather than its appearance.
 *
 * Crucible’s layout model is inspired by CSS Flexbox but intentionally
 * simpler. It omits features such as grid layouts and flex grow/shrink
 * to maintain a straightforward and predictable layout system.
 */
export interface LayoutProps extends
    JustifyProps,
    AlignProps,
    OverflowProps,
    ContentDirectionProps { }

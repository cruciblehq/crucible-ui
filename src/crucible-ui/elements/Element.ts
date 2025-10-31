import type { Ref } from '../refs';
import type {
    Component,
    ComponentProps,
    ComponentState,
    ComponentType,
    ContainerProps,
    ContainerState,
    ContainerType,
} from '../components';

/**
 * Base structural type for all Crucible elements.
 *
 * Crucible elements are immutable descriptions of component instances,
 * analogous to React elements but designed for Crucible’s component model.
 * They are produced by element factory functions (e.g., `createElement`)
 * and consumed by the Crucible reconciler to construct live component instances.
 *
 * Crucible follows React’s element object shape for interoperability but
 * introduces the internal `__crucible_ctor` property to retain the actual
 * component constructor. The public `type` field remains a string so that
 * React treats Crucible elements as host primitives and delegates them to
 * Crucible’s reconciler.
 *
 * @typeParam T - The constructor type of the Crucible component class.
 */
type ElementBase<T extends abstract new (...args: any[]) => Component> = { // eslint-disable-line @typescript-eslint/no-explicit-any

    /**
     * The React element type marker symbol. Identifies this object as a
     * valid React-compatible element at runtime.
     */
    readonly $$typeof: symbol;

    /**
     * The Crucible component constructor for this element. Retained
     * internally to instantiate the correct component class during
     * reconciliation.
     */
    readonly __crucible_ctor: T;

    /**
     * The public element type name. Always a string to ensure that React’s
     * reconciler treats Crucible elements as host primitives and passes
     * them to Crucible’s custom renderer.
     */
    readonly type: string;

    /**
     * Optional key used to identify this element within its parent. Preserved
     * for React compatibility.
     */
    readonly key?: string;

    /**
     * Optional reference to the live component instance once created. Used to
     * support ref forwarding.
     */
    readonly ref?: Ref;
};

/**
 * Represents a Crucible element describing a non-container component instance.
 *
 * This corresponds to the basic form of a JSX element (e.g., `<Text>`).
 * The element is immutable and contains all the information necessary
 * for the reconciler to create and manage the corresponding live component.
 *
 * @typeParam ComponentPropsT - The type of the props accepted by the component.
 * @typeParam ComponentStateT - The type of the state maintained by the component.
 * @typeParam ComponentT - The constructor type of the component represented.
 */
export type Element<
    ComponentPropsT extends ComponentProps = ComponentProps,
    ComponentStateT extends ComponentState = ComponentState,
    ComponentT extends ComponentType<ComponentPropsT, ComponentStateT> = ComponentType<ComponentPropsT, ComponentStateT>
> =
    ElementBase<ComponentT> & {

        /**
         * The props used to configure the component instance represented by
         * the element. Derived from the component’s prop type definition.
         */
        readonly props: InstanceType<ComponentT>["props"];
    };

/**
 * Represents a Crucible element describing a container component instance.
 *
 * Containers can hold child elements within their props. Each child is
 * itself a Crucible element, forming a recursive element tree structure.
 * This mirrors React’s convention of defining `children` as part of props,
 * even though Crucible’s runtime treats children as separate entities.
 *
 * @typeParam ContainerPropsT - The type of the props accepted by the container.
 * @typeParam ContainerStateT - The type of the state maintained by the container.
 * @typeParam ContainerT - The constructor type of the container represented.
 */
export type ContainerElement<
    ContainerPropsT extends ContainerProps = ContainerProps,
    ContainerStateT extends ContainerState = ContainerState,
    ContainerT extends ContainerType<ContainerPropsT, ContainerStateT> = ContainerType<ContainerPropsT, ContainerStateT>
> =
    ElementBase<ContainerT> & {

        /**
         * The props of the container, including its immutable list of child
         * elements. Each child element corresponds to another Crucible
         * component in the tree.
         */
        readonly props: InstanceType<ContainerT>["props"] & {

            /**
             * The child elements contained within this container. Each child
             * is itself a Crucible element representing another component.
             *
             * This is an unfortunate inheritance from React’s model where
             * `children` are part of props, even though Crucible treats them
             * as first-class entities in its reconciliation process.
             */
            readonly children: Element<typeof Component>[];
        };
    };

/**
 * Represents a Crucible element that explicitly embeds its constructor type
 * in both the top-level and props. This form is used internally in Crucible’s
 * rendering pipeline to retain full type information about the element’s
 * constructor at every level.
 *
 * @typeParam T - The constructor type of the component represented by this element.
 */
export type ElementWithCtor<T extends abstract new (...args: any[]) => Component> = // eslint-disable-line @typescript-eslint/no-explicit-any
    ElementBase<T> & {

        /**
         * The props of this element, including a duplicate `__crucible_ctor`
         * field for internal reconciliation convenience.
         */
        readonly props: InstanceType<T>["props"] & {

            /**
             * The Crucible component constructor for this element. Retained
             * internally to instantiate the correct component class during
             * reconciliation, since the public `type` field is a string. This
             * duplicate allows internal code to access the constructor without
             * needing to reference the top-level element structure. This is
             * a workaround for forcing React to treat Crucible components as
             * host primitives.
             */
            readonly __crucible_ctor: T;
        };
    };

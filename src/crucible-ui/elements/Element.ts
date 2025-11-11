import type { Ref } from '../interface';
import type {
    Component,
    ComponentProps,
    ComponentState,
    ComponentType,
    ContainerProps,
    ContainerState,
    ContainerType,
    ContentProps,
    ContentState,
    ContentType
} from '../components';

/**
 * Base structural type for all Crucible elements.
 *
 * Crucible elements are immutable descriptions of component instances,
 * analogous to React elements but designed for Crucible’s component model.
 * They are produced by element factory functions (e.g., {@link createElement})
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
     * The React element type marker symbol. Identifies this object as a valid
     * React-compatible element at runtime.
     */
    readonly $$typeof: symbol;

    /**
     * The Crucible component constructor for this element. Retained internally
     * to instantiate the correct component class during reconciliation.
     */
    readonly __crucible_ctor: T;

    /**
     * The public element type name. Always a string to ensure that React’s
     * reconciler treats Crucible elements as host primitives and passes
     * them to Crucible’s custom renderer. The actual constructor is stored
     * in `__crucible_ctor`.
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
    readonly ref?: Ref<Component>;

    /**
     * The props used to configure the component instance represented by
     * the element. Derived from the component’s prop type definition.
     */
    readonly props: InstanceType<T>["props"];
};

/**
 * Represents a Crucible element describing a component instance.
 *
 * This corresponds to the basic form of a JSX element (e.g., `<Input>`). The
 * element is immutable and contains all the information necessary for the
 * reconciler to create and manage the corresponding live component.
 *
 * @typeParam ComponentPropsT - The type of the props accepted by the component.
 * @typeParam ComponentStateT - The type of the state maintained by the component.
 * @typeParam ComponentT - The constructor type of the component represented.
 */
export type Element<
    ComponentPropsT extends ComponentProps = ComponentProps,
    ComponentStateT extends ComponentState = ComponentState,
    ComponentTypeT extends ComponentType<ComponentPropsT, ComponentStateT> = ComponentType<ComponentPropsT, ComponentStateT>
> = ElementBase<ComponentTypeT>;

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
    ContainerTypeT extends ContainerType<ContainerPropsT, ContainerStateT> = ContainerType<ContainerPropsT, ContainerStateT>
> = ElementBase<ContainerTypeT> & {

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

/**
 * Represents a Crucible element describing a content component instance.
 * 
 * Content components represent leaf nodes that encapsulate raw content,
 * such as text or media. This element type captures the props specific to
 * content components.
 * 
 * @typeParam ContentPropsT - The type of the props.
 * @typeParam ContentStateT - The type of the state.
 * @typeParam ContentTypeT - The constructor type of the content component.
 */
export type ContentElement<
    ContentPropsT extends ContentProps = ContentProps,
    ContentStateT extends ContentState = ContentState,
    ContentTypeT extends ContentType<ContentPropsT, ContentStateT> = ContentType<ContentPropsT, ContentStateT>
> = ElementBase<ContentTypeT> & {

    /**
     * The content managed by this content component.
     * 
     * At the element level, this is a simple string representing the raw
     * textual content. The actual rendering and interpretation of this
     * content is handled by the corresponding content component instance
     * at runtime (e.g., Text).
     */
    readonly content: string;
};

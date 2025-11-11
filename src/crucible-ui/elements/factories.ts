import type {
    Element,
    ContainerElement,
    ContentElement
} from './Element';
import {
    type Composite,
    type CompositeProps,
    isComposite
} from './Composite';
import {
    type ConcreteContainerType,
    type ConcreteComponentType,
    type ContainerProps,
    type ContainerState,
    type ComponentProps,
    type ComponentState,
    type ContentProps,
    type ContentState,
    type ContentType,
    Component,
    Container,
    Content,
} from "../components";

/**
 * Represents a props object that includes Crucible’s internal constructor
 * reference. This is used internally to retain type information about the
 * component constructor during reconciliation.
 *
 * @typeParam T - The constructor type of the component.
 */
export interface Ctor<
    T extends new (...args: any[]) => Component // eslint-disable-line @typescript-eslint/no-explicit-any
> {

    /**
     * The Crucible component constructor for the component associated with
     * this props. Retained internally to instantiate the correct component
     * class during reconciliation, since the public `type` field is a string.
     * This is a workaround for forcing React to treat Crucible components as
     * host primitives.
     */
    readonly __crucible_ctor: T;
}

/**
 * Injects Crucible’s internal constructor reference into a props object.
 *
 * This function ensures the given Crucible element carries a reference to its
 * original component constructor under the `__crucible_ctor` field. This is
 * required because Crucible elements use a string `type` value for React
 * compatibility, which hides the actual class reference that the Crucible
 * reconciler needs during instantiation.
 *
 * @typeParam ComponentPropsT - The type of props.
 * @typeParam ComponentStateT - The type of state.
 * @typeParam ComponentTypeT - The constructor type of the component.
 * 
 * @param type - The constructor of the Crucible component.
 * @param props - The props for the component instance.
 * 
 * @returns A new props object including `__crucible_ctor`.
 */
function injectCrucibleCtor<
    ComponentPropsT extends ComponentProps,
    ComponentStateT extends ComponentState,
    ComponentTypeT extends ConcreteComponentType<ComponentPropsT, ComponentStateT>
>(
    type: ComponentTypeT,
    props: ComponentPropsT
): ComponentPropsT & Ctor<ComponentTypeT> {

    // This is a security measure to prevent callers from overwriting the
    // internal constructor reference. If __crucible_ctor was defined in the
    // original props, it could indicate an attempt to make Crucible use a
    // different component class than intended, which could lead to
    // unpredictable behavior (e.g., inject code to run outside the SES sandbox).
    if (props && "__crucible_ctor" in props) {
        throw new Error("Props object must not already contain '__crucible_ctor'.");
    }

    return {
        ...props,
        __crucible_ctor: type,
    };
}

/**
 * Ejects Crucible’s internal constructor reference from a props object.
 * 
 * This function removes the `__crucible_ctor` field from a props object,
 * returning the original component constructor along with a clean props object.
 * 
 * @typeParam ComponentPropsT - The type of props.
 * @typeParam ComponentStateT - The type of state.
 * @typeParam ComponentTypeT - The constructor type of the component.
 * 
 * @param props - The props object containing `__crucible_ctor`.
 * 
 * @returns A tuple with the component constructor and cleaned props.
 */
export function ejectCrucibleCtor<
    ComponentPropsT extends ComponentProps,
    ComponentStateT extends ComponentState,
    ComponentTypeT extends ConcreteComponentType<ComponentPropsT, ComponentStateT>
>(
    props: ComponentPropsT & Ctor<ComponentTypeT>
): [ComponentTypeT, ComponentPropsT] {

    // Eject __crucible_ctor
    const { __crucible_ctor, ...rest } = props;

    // Validate
    if (typeof __crucible_ctor !== "function" || !(__crucible_ctor.prototype instanceof Component)) {
        throw new TypeError("Missing or invalid Component constructor during instantiation.");
    }

    return [__crucible_ctor, rest as unknown as ComponentPropsT];
}

/**
 * Creates a Crucible element representing a container component.
 *
 * Containers can hold child elements, so this overload includes a variadic
 * `children` parameter. The resulting element conforms to React’s element shape
 * while embedding Crucible-specific metadata (`__crucible_ctor`) used by the
 * custom reconciler.
 *
 * @typeParam ContainerPropsT - The type of the props accepted by the container.
 * @typeParam ContainerStateT - The type of the state maintained by the container.
 * @typeParam ContainerTypeT - The container component type.
 * 
 * @param type - The class constructor for the container component.
 * @param props - The props object defining the container’s configuration.
 * @param children - The child elements contained within this container.
 * 
 * @returns A Crucible container element.
 */
export function createElement<
    ContainerPropsT extends ContainerProps,
    ContainerStateT extends ContainerState,
    ContainerTypeT extends ConcreteContainerType<ContainerPropsT, ContainerStateT>
>(
    type: ContainerTypeT,
    props: InstanceType<ContainerTypeT>["props"],
    ...children: Element<typeof Component>[]
): ContainerElement<ContainerPropsT, ContainerStateT, ContainerTypeT>;

/**
 * Creates a Crucible element representing a content component.
 *
 * Content components encapsulate raw content, such as text. This overload
 * includes a `content` parameter to specify the content managed by the
 * component. The resulting element conforms to React’s element shape while
 * embedding Crucible-specific metadata used by the reconciler.
 * 
 * @typeParam ContentPropsT - The type of the props.
 * @typeParam ContentStateT - The type of the state.
 * @typeParam ContentTypeT - The content component type.
 * 
 * @param type - The class constructor for the content component.
 * @param props - The props object defining the component’s configuration.
 * @param content - The raw content managed by the content component.
 * 
 * @returns A Crucible content element.
 */
export function createElement<
    ContentPropsT extends ContentProps,
    ContentStateT extends ContentState,
    ContentTypeT extends ContentType<ContentPropsT, ContentStateT>
>(
    type: ContentTypeT,
    props: InstanceType<ContentTypeT>["props"],
    content: string
): ContentElement<ContentPropsT, ContentStateT, ContentTypeT>;

/**
 * Creates a Crucible element representing a component.
 *
 * Non-container, non-content components cannot have children or content. The
 * resulting element conforms to React’s element structure, making it
 * recognizable by React’s fiber system while maintaining Crucible-specific
 * metadata for the Crucible reconciler.
 *
 * @typeParam ComponentTypeT - The non-container component type.
 * @typeParam ComponentPropsT - The type of the props.
 * @typeParam ComponentStateT - The type of the state.
 * 
 * @param type - The class constructor for the component.
 * @param props - The props object defining the component’s configuration.
 * 
 * @returns A Crucible element describing the component instance.
 */
export function createElement<
    ComponentPropsT extends ComponentProps,
    ComponentStateT extends ComponentState,
    ComponentTypeT extends ConcreteComponentType<ComponentPropsT, ComponentStateT>
>(
    type: ComponentTypeT,
    props: InstanceType<ComponentTypeT>["props"]
): Element<ComponentPropsT, ComponentStateT, ComponentTypeT>;

/**
 * Overload for composites.
 *
 * Composites are function-based components. They are rendered immediately,
 * returning their internal Crucible element subtree.
 *
 * @param type - The composite callback function.
 * @param props - The props for the composite.
 * 
 * @returns The rendered Crucible element.
 */
export function createElement(
    type: Composite,
    props: CompositeProps,
    ...children: unknown[]
): Element<
    ComponentProps,
    ComponentState,
    ConcreteComponentType<
        ComponentProps,
        ComponentState
    >
>;

/**
 * Core implementation for Crucible’s `createElement` factory.
 *
 * This function is called by both JSX and internal code to create element
 * objects compatible with React’s element shape while preserving Crucible’s
 * metadata. Crucible uses this factory to intercept JSX element creation and
 * map Crucible component classes into React-compatible element objects.
 *
 * The reconciler later interprets the resulting element’s metadata to create
 * live component instances.
 *
 * @param type - The class constructor for the component.
 * @param props - The props object defining the component’s configuration.
 * @param children - Optional child elements (for container components).
 * 
 * @returns A Crucible element representing the component instance.
 */
export function createElement(
    type: ConcreteComponentType | Composite,
    props: ComponentProps | CompositeProps,
    ...rest: unknown[]
): Element<
    ComponentProps,
    ComponentState,
    ConcreteComponentType<
        ComponentProps,
        ComponentState
    >
> {

    // Composites are called immediately to produce their element subtree.
    if (isComposite(type)) {
        return type(props as CompositeProps);
    }

    // Ensure the Crucible constructor reference is embedded in props.
    props = injectCrucibleCtor(type, props);

    // Containers accept children
    if (type.prototype instanceof Container) {
        props = {
            ...props,
            children: ([] as Element<typeof Component>[]).concat(
                ...rest as Element<typeof Component>[]
            ),
        } as unknown as ContainerProps;
    }

    // Content components accept raw content
    else if (type.prototype instanceof Content) {
        const [content] = rest as [string];
        props = {
            ...props,
            content,
        } as unknown as ContentProps;
    }

    // Return a React-compatible element object with Crucible metadata.
    return {
        $$typeof: Symbol.for("react.element"),
        type: type.name,
        ref: null,
        props,
    } as Element<
        ComponentProps, ComponentState, ConcreteComponentType<
            ComponentProps,
            ComponentState
        >
    >;
}

/**
 * Exported under a mangled name for automatic injection by the JSX runtime.
 *
 * The build system rewrites JSX calls to use `__Crucible_createElement`
 * instead of the standard `React.createElement`. This allows Crucible to
 * control how JSX is translated into element objects without requiring
 * explicit imports in user code.
 *
 * This alias should not be used directly.
 */
export { createElement as __Crucible_createElement };

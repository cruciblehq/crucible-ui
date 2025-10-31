import type { Element, ContainerElement, ElementWithCtor } from './Element';
import {
    type ConcreteContainerType,
    type ConcreteComponentType,
    type ContainerProps,
    type ContainerState,
    type ComponentProps,
    type ComponentState,
    type Composite,
    type CompositeProps,
    Container,
    Component,
} from "../components";

/**
 * Injects Crucible’s internal constructor reference into a props object.
 *
 * This function ensures the given Crucible element carries a reference to its
 * original component constructor under the `__crucible_ctor` field. This is
 * required because Crucible elements use a string `type` value for React
 * compatibility, which hides the actual class reference that the Crucible
 * reconciler needs during instantiation.
 *
 * @typeParam ComponentPropsT - The type of the props accepted by the component.
 * @typeParam ComponentStateT - The type of the state maintained by the component.
 * @typeParam ComponentTypeT - The constructor type of the component.
 * @param type - The constructor of the Crucible component.
 * @param props - The props for the component instance.
 * @returns A new props object including `__crucible_ctor`.
 */
function injectCrucibleCtor<
    ComponentPropsT extends ComponentProps,
    ComponentStateT extends ComponentState,
    ComponentTypeT extends ConcreteComponentType<ComponentPropsT, ComponentStateT>
>(
    type: ComponentTypeT,
    props: InstanceType<ComponentTypeT>["props"]
): ElementWithCtor<ComponentTypeT>["props"] {
    return {
        __crucible_ctor: type,
        ...props,
    };
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
 * @param api - The API instance provided to components.
 * @param type - The class constructor for the container component.
 * @param props - The props object defining the container’s configuration.
 * @param children - The child elements contained within this container.
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
 * Creates a Crucible element representing a non-container component.
 *
 * Non-container components cannot have children. The resulting element
 * conforms to React’s element structure, making it recognizable by React’s
 * fiber system while maintaining Crucible-specific metadata for the
 * Crucible reconciler.
 *
 * @typeParam ComponentTypeT - The non-container component type.
 * @typeParam ComponentPropsT - The type of the props accepted by the component.
 * @typeParam ComponentStateT - The type of the state maintained by the component.
 * @param api - The API instance provided to components.
 * @param type - The class constructor for the component.
 * @param props - The props object defining the component’s configuration.
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
 * @returns The rendered Crucible element.
 */
export function createElement(
    type: Composite,
    props: CompositeProps
): Element<ConcreteComponentType>;

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
 * @param api - The API instance provided to components.
 * @param type - The class constructor for the component.
 * @param props - The props object defining the component’s configuration.
 * @param children - Optional child elements (for container components).
 * @returns A Crucible element representing the component instance.
 */
export function createElement(
    type: ConcreteComponentType | Composite,
    props: InstanceType<ConcreteComponentType>["props"],
    ...children: Element<typeof Component>[]
): Element<ConcreteComponentType> {

    // Composites are called immediately to produce their element subtree.
    if (isComposite(type)) {
        return type(props);
    }

    // Ensure the Crucible constructor reference is embedded in props.
    props = injectCrucibleCtor(type, props);

    // Containers accept children
    if (type.prototype instanceof Container) {
        props = {
            ...props,
            children: ([] as Element<typeof Component>[]).concat(...children),
        } as unknown as ContainerProps;
    }

    // Return a React-compatible element object with Crucible metadata.
    return {
        $$typeof: Symbol.for("react.element"),
        type: type.name,
        ref: null,
        props,
    } as Element<ConcreteComponentType>;
}
/**
 * Type guard to determine if a type is a Composite.
 *
 * This type check returns whether the provided type is a {@link Composite}
 * or a {@link ConcreteComponentType}.
 *
 * @param type - The type to check.
 * @returns `true` if the type is a Composite; `false` otherwise.
 */
function isComposite(type: ConcreteComponentType | Composite): type is Composite {
    return !type.prototype || !(type.prototype instanceof Component);
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

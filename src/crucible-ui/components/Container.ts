import {
    type ComponentProps,
    type ComponentState,
    Component,
} from "./Component";

/**
 * Defines the properties accepted by container components.
 *
 * Containers are layout components that can group or nest other Crucible
 * components. This interface extends {@link ComponentProps} and introduces
 * the `children` property, which holds the contained components.
 */
export interface ContainerProps extends ComponentProps {

    /**
     * The child components managed by the container.
     */
    children: Component[];
}

/**
 * Represents the internal state of a container component.
 *
 * Containers generally have minimal or no internal state. This interface
 * extends {@link ComponentState} for consistency across the component model.
 */
export interface ContainerState extends ComponentState { }

/**
 * Abstract base class for all container components in Crucible UI.
 *
 * A container defines structural composition and provides methods to manage
 * child components, such as appending, inserting, or removing them. Concrete
 * implementations (e.g., `View`,  etc.) define specific layout semantics. The
 * base implementation provides no behavior.
 *
 * @typeParam PropsT - The property type accepted by the container.
 * @typeParam StateT - The state type maintained by the container.
 */
export abstract class Container<
    PropsT extends ContainerProps = ContainerProps,
    StateT extends ContainerState = ContainerState
> extends Component<PropsT, StateT> {

    /**
     * Appends a child component to the container.
     */
    appendChild(_child: Component): void {
        // No-op
    }

    /**
     * Inserts a child component before another child.
     */
    insertChildBefore(_child: Component, _before: Component): void {
        // No-op
    }

    /**
     * Removes a child component from the container.
     */
    removeChild(_child: Component): void {
        // No-op
    }
}

/**
 * Defines the constructor signature for an abstract container component type.
 *
 * This type is used when referring to a container class itself (not an instance),
 * such as in type validation, JSX element typing, or during element creation.
 * It captures the shape of any class that extends `Container` without requiring
 * that the class be instantiable.
 *
 * @typeParam ContainerPropsT - The type of the props accepted by the container component.
 * @typeParam ContainerStateT - The type of the internal state maintained by the container component.
 *
 * @param props - The props used to initialize the container.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type ContainerType<
    ContainerPropsT extends ContainerProps = ContainerProps,
    ContainerStateT extends ContainerState = ContainerState
> = abstract new (
    props: ContainerPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Container<ContainerPropsT, ContainerStateT>;

/**
 * Defines the constructor signature for a concrete container component type.
 *
 * This type represents a container class that can be instantiated, typically
 * used in the rendering pipeline or by the reconciler when constructing
 * live component instances.
 *
 * @typeParam ContainerPropsT - The type of the props accepted by the container component.
 * @typeParam ContainerStateT - The type of the internal state maintained by the container component.
 *
 * @param props - The props used to initialize the container.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type ConcreteContainerType<
    ContainerPropsT extends ContainerProps = ContainerProps,
    ContainerStateT extends ContainerState = ContainerState
> = new (
    props: ContainerPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Container<ContainerPropsT, ContainerStateT>;

import type { Component, ComponentType, ComponentProps, ComponentState } from './Component';

/**
 * Interface representing a container component that can hold child components.
 * This interface is implemented by components that can contain other components,
 * allowing for a hierarchical component structure. Container components must
 * set the static 'isContainer' property to true in their class definitions.
 * The generic parameters allow for specifying the types of props, state, and
 * snapshot for the child components contained within the container.
 */
export interface Container<
    ChildT extends Component<ComponentProps, ComponentState> = Component<ComponentProps, ComponentState>
> {

    /**
     * The child components contained within this container. This is an array
     * of components that are direct children of the container.
     */
    readonly children: ChildT[];

    /**
     * Appends a child component to this container.
     * 
     * @param child The child component to append.
     */
    appendChild(child: ChildT): void;

    /**
     * Inserts a child component before another child in this container.
     * 
     * @param child The child component to insert.
     * @param beforeChild The existing child component to insert before.
     */
    insertChildBefore(child: ChildT, beforeChild: ChildT): void;

    /**
     * Removes a child component from this container.
     * 
     * @param child The child component to remove.
     */
    removeChild(child: ChildT): void;
}

/**
 * Type guard to check if a component implements the Container interface,
 * based on the static isContainer property of its class. This indicates
 * whether the component can hold children.
 * 
 * @param component The component to check.
 * @returns True if the component is a Container; otherwise, false.
 */
export function isContainer<
    ChildT extends Component<ComponentProps, ComponentState> = Component<ComponentProps, ComponentState>
>(
    component: ChildT
): component is ChildT & Container<ChildT> {
    const ctor = component.constructor as Partial<
        ComponentType<ComponentProps, ComponentState>
    >;
    return ctor.isContainer === true;
}

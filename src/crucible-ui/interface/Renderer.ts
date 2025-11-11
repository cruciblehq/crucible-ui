import type { Component, ComponentType, ComponentProps } from '../components';
import type { Context } from '../interface';

/**
 * Renderer interface defining the contract for rendering components into
 * host containers. Implementations of this interface must provide the logic
 * to render and update components within the specified container types,
 * handling all necessary platform-specific rendering details.
 */
export interface Renderer<
    HostContainer extends object,
    HostInstance extends object,
    HostTextInstance extends object,
    HostContext extends Context
> {

    /**
    * Get the root host context for the given root container. This method
    * is called at the start of rendering to establish any necessary context
    * for the root of the component tree. The returned context object is
    * then passed down to all child components during rendering.
    *
    * @param rootContainer The root container being rendered into.
    * @returns The host context for the root of the tree.
    */
    getRootHostContext(rootContainer: HostContainer): HostContext

    /**
     * Get the host context for a child component based on its parent context
     * and type. This method is called when rendering a child component to
     * determine any context that should be passed down from the parent.
     * The returned context object is then provided to the child component
     * during its rendering.
     *
     * @param parentHostContext The host context of the parent component.
     * @param type The type of the child component being rendered.
     * @param rootContainer The root container being rendered into.
     * @returns The host context for the child component.
     */
    getChildHostContext(
        parentHostContext: HostContext,
        type: ComponentType,
        rootContainer: HostContainer
    ): HostContext

    /**
     * Creates a new instance of a component. This method is responsible for
     * instantiating the component and returning the corresponding host instance
     * that represents it in the host environment.
     *
     * @param component The component to create an instance of.
     * @param rootContainer The root container being rendered into.
     * @returns The created host instance.
     */
    createInstance(
        component: Component,
        rootContainer: HostContainer,
        hostContext: HostContext
    ): HostInstance

    /**
     * 
     */
    createTextInstance(
        text: string,
        rootContainer: HostContainer,
        hostContext: HostContext
    ): HostTextInstance

    /**
     * Append an initial child to a parent host instance. This is called
     * during the initial rendering phase to build up the component tree.
     *
     * @param parent The parent host instance to append the child to.
     * @param child The child host instance to append.
     */
    appendInitialChild(parent: HostInstance, child: HostInstance): void

    /**
     * Perform any necessary actions after a component has been mounted.
     * This is called after the component and all its children have been
     * attached to the tree and are visible. Typical work done here
     * includes setting focus, starting animations, or other actions
     * that require the component to be part of the committed tree.
     *
     * @param instance The component instance that was mounted.
     * @param type The component type.
     * @param props The component props.
     */
    commitMount(
        instance: HostInstance,
        type: ComponentType,
        props: ComponentProps
    ): void

    /**
     * Insert a child host instance before another child in a parent component.
     * This is called during updates to insert new child components at
     * specific positions within existing parents.
     *
     * @param parent The parent component to insert the child into.
     * @param child The child component to insert.
     * @param beforeChild The existing child component to insert before.
     */
    insertBefore(
        parent: HostInstance,
        child: HostInstance,
        beforeChild: HostInstance
    ): void

    /**
     * Remove a child host instance from a parent component. This is called
     * during updates to remove child components from existing parents.
     *
     * @param parent The parent instance to remove the child from.
     * @param child The child instance to remove.
     */
    removeChild(parent: HostInstance, child: HostInstance): void

    /**
     * Append a child host instance to a container. Called during mounting
     * to add top-level components to the container.
     *
     * @param container The host container to append the child to.
     * @param child The child instance to append.
     */
    appendChildToContainer(
        container: HostContainer,
        child: HostInstance
    ): void

    /**
     * Insert a child instance before another child in a container. Called
     * during mounting to insert top-level instances at specific positions
     * within the container.
     *
     * @param container The host container to insert the child into.
     * @param child The child instance to insert.
     * @param beforeChild The existing child instance to insert before.
     */
    insertInContainerBefore(
        container: HostContainer,
        child: HostInstance,
        beforeChild: HostInstance
    ): void

    /**
     * Remove a child instance from a container. Called during unmounting
     * to remove top-level instances from the container.
     *
     * @param container The host container to remove the child from.
     * @param child The child instance to remove.
     */
    removeChildFromContainer(container: HostContainer, child: HostInstance): void

    /**
     * Clear all content from a container. Called to remove all instances
     * from the container, typically during unmounting or reinitialization.
     *
     * @param container The host container to clear.
     */
    clearContainer(container: HostContainer): void
}

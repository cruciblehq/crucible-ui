import type { Intent } from '../intents';

/**
 * Renderer interface defining the contract for rendering intents into host
 * containers. Implementations of this interface must provide the logic to
 * render and update intents within the specified container types, handling
 * all necessary platform-specific rendering details.
 */
export interface Renderer<
    HostContainer extends object,
    HostInstance extends object
> {

    /**
     * Creates a new host instance. This method is responsible for rendering
     * the intent and returning the corresponding host instance that represents
     * it in the host environment.
     * 
     * This method should reconciliate any necessary properties from the intent
     * with configurations determined at the composition layer.
     *
     * @param intent The intent to create an instance of.
     * @param rootContainer The root container being rendered into.
     * 
     * @returns The created host instance.
     */
    createInstance(
        intent: Intent,
        rootContainer: HostContainer
    ): HostInstance

    /**
     * Append a child host instance to a parent host instance. This is called
     * during updates to add new children to existing parents.
     *
     * @param parent The parent host instance to append the child to.
     * @param child The child host instance to append.
     */
    appendChild(parent: HostInstance, child: HostInstance): void

    /**
     * Append a child host instance to a host container. Called during mounting
     * to add top-level components to the container.
     *
     * @param container The host container to append the child to.
     * @param child The child instance to append.
     */
    appendChildToContainer(
        container: HostContainer,
        child: HostInstance
    ): void
}

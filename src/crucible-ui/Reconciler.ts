import type ReactReconciler from 'react-reconciler';
import type { Renderer, Context } from './interface';
import { Bridge } from './utils';
import {
    type Ctor,
    ejectCrucibleCtor
} from './elements';
import {
    type ComponentType,
    type ConcreteComponentType,
    type ComponentProps,
    type Component,
    type ComponentState,
    Container,
    Content,
} from './components';

/**
 * Reconciler class that integrates React's reconciler with Crucible UI's
 * rendering system.
 * 
 * This class manages the reconciliation process, delegating platform-specific
 * rendering tasks to the provided {@link Renderer}. It defines how components
 * are created, updated, and managed within the Crucible UI environment.
 */
export class Reconciler<
    HostContainer extends object,
    HostInstance extends object,
    HostTextInstance extends object,
    HostContext extends Context
> {

    /**
     * The renderer implementation used by this reconciler.
     * 
     * The renderer is responsible for creating and managing host instances,
     * handling platform-specific rendering details.
     */
    readonly #renderer: Renderer<
        HostContainer,
        HostInstance,
        HostTextInstance,
        HostContext
    >;

    /**
     * The list of root components managed by the reconciler.
     * 
     * This array tracks the top-level components that have been rendered
     * into the host container.
     */
    readonly #rootComponents: Component[];

    /**
     * Bridge mapping between component instances and their corresponding
     * host instances.
     * 
     * This bridge allows the reconciler to associate Crucible UI components
     * with their underlying host representations.
     */
    readonly #bridge: Bridge<HostInstance>;

    /**
     * Creates a new Reconciler.
     * 
     * @param renderer The renderer implementation to use for host operations.
     */
    constructor(
        renderer: Renderer<
            HostContainer,
            HostInstance,
            HostTextInstance,
            HostContext
        >
    ) {
        this.#renderer = renderer;
        this.#rootComponents = [];
        this.#bridge = new Bridge<HostInstance>();
    }

    /**
     * Indicates whether this host configuration supports mutation of the
     * component tree.
     * 
     * When true, React Reconciler will call mutation methods (e.g., appendChild,
     * removeChild) to update the tree in place. When false, persistence methods
     * (e.g., cloneInstance) would be used instead to create new versions of
     * components without mutating existing ones. Crucible UI uses mutation.
     *
     * @returns True if mutation is supported; otherwise, false.
     */
    get supportsMutation(): boolean {
        return true;
    }

    /**
     * Indicates whether this host configuration supports hydration of
     * server-rendered content.
     * 
     * When true, React Reconciler will attempt to reuse existing host instances
     * rendered on the server instead of creating new ones. When false, hydration
     * is not supported and all content is rendered from scratch on the client.
     *
     * @returns True if hydration is supported; otherwise, false.
     */
    get supportsHydration(): boolean {
        return false;   // Not supported yet
    }

    /**
     * Indicates whether this renderer should be treated as the primary
     * renderer when multiple renderers are used in the same application.
     * 
     * When true, this renderer will be prioritized for rendering tasks and
     * event handling. Crucible UI is designed to be the primary renderer in
     * its environment.
     *
     * @returns True if this is the primary renderer; otherwise, false.
     */
    get isPrimaryRenderer(): boolean {
        return true;
    }

    /**
     * Indicates whether this host configuration supports persistence of the
     * component tree.
     * 
     * When true, React's reconciler will call persistence methods (e.g.,
     * cloneInstance) to create new versions of components without mutating
     * existing ones. When false, mutation methods (e.g., appendChild,
     * removeChild) are used to update the tree in place. Crucible UI uses
     * mutation and does not support persistence.
     *
     * @returns True if persistence is supported; otherwise, false.
     */
    get supportsPersistence(): boolean {
        return false;
    }

    /**
     * Determines whether a component type should receive text content directly
     * through its constructor instead of separate text instances.
     * 
     * This is used to support components that are designed to encapsulate text
     * content, such as {@link Text}. When this method returns true for a
     * component type, the reconciler will pass text content as part of the
     * component's props during instantiation. When false, it will create
     * separate text instances for any text content within the component.
     * 
     * @remarks The `type` parameter is not used directly since Crucible
     * components are instantiated via their constructors extracted from props.
     * 
     * @param type The component type (constructor) being evaluated.
     * @param props The props of the component being evaluated.
     * @returns True if the component should receive text content directly;
     *          otherwise, false.
     */
    shouldSetTextContent(
        _type: ComponentType,
        props: ComponentProps
    ): boolean {

        // Eject __crucible_ctor
        const [__crucible_ctor, _rest] = ejectCrucibleCtor<
            ComponentProps,
            ComponentState,
            ConcreteComponentType
        >(
            props as ComponentProps & Ctor<ConcreteComponentType>
        );

        // Determine if the component is a Content or subclass
        return Object.is(__crucible_ctor, Content) || __crucible_ctor.prototype instanceof Content;
    }

    /**
     * Creates a new instance of a component.
     * 
     * This method is responsible for instantiating the component and returning
     * the corresponding host instance that represents it in the host environment.
     * It maintains the mapping between the component and its host instance via
     * the bridge and delegates native instance creation to the renderer.
     * 
     * @remarks The `type` parameter is not used directly since Crucible
     * components are instantiated via their constructors extracted from props.
     * 
     * @param type The component type (constructor) to create an instance of.
     * @param props The props to pass to the component constructor.
     * @param rootContainer The root container being rendered into.
     * @param hostContext The host context for the instance.
     * @param internalHandle An internal handle used by React Reconciler. The
     *                       type is unknown to prevent leaking react types.
     * @returns The created host instance.
     */
    createInstance(
        _type: ComponentType,
        props: ComponentProps,
        rootContainer: HostContainer,
        hostContext: HostContext,
        _internalHandle: unknown
    ): HostInstance {

        // Eject __crucible_ctor
        const [__crucible_ctor, rest] = ejectCrucibleCtor<
            ComponentProps,
            ComponentState,
            ConcreteComponentType
        >(
            props as ComponentProps & Ctor<ConcreteComponentType>
        );

        // Instantiate
        const component = new __crucible_ctor(rest);
        const instance = this.#renderer.createInstance(component, rootContainer, hostContext);

        // Associate
        this.#bridge.set(component, instance);

        return instance;
    }

    /**
     * Create a text instance to represent bare text content within the
     * component tree.
     * 
     * This method is called when React encounters text nodes in JSX (e.g.,
     * <View>Hello</View>) and the parent component does not handle text content
     * directly. The returned text instance will be used to manage and render
     * the text content within the tree.
     * 
     * @param text The text content to create an instance for.
     * @param rootContainer The root container being rendered into.
     * @param hostContext The host context for the text instance.
     * @param internalHandle An internal handle used by React Reconciler. The
     *                       type is unknown to prevent leaking react types.
     * @returns The created text instance.
     */
    createTextInstance(
        text: string,
        rootContainer: HostContainer,
        hostContext: HostContext,
        _internalHandle: unknown
    ): HostTextInstance {
        return this.#renderer.createTextInstance(
            text,
            rootContainer,
            hostContext,
        );
    }

    /**
     * Get the public instance exposed to refs for a given component instance.
     * 
     * This method allows the host configuration to control what is returned
     * when a ref is attached to a component.
     *
     * @param instance The component instance.
     * @returns The public instance exposed to refs.
     */
    getPublicInstance(instance: HostInstance): Component {
        return this.#bridge.getComponent(instance)!;
    }

    /**
     * Append an initial child to a parent host instance.
     * 
     * This is called during the initial rendering phase to build up the
     * component tree.
     *
     * @param parent The parent host instance to append the child to.
     * @param child The child host instance to append.
     */
    appendInitialChild(parent: HostInstance, child: HostInstance): void {
        this.appendChild(parent, child);
    }

    /**
     * Called after creating an instance and appending all initial children,
     * but before the instance is attached to the tree. Used to perform any
     * final setup or initialization that requires all children to be present.
     * Work here should be limited to setup that does not require the instance
     * to be visible or part of the committed tree. Such work (e.g. focus,
     * animation, etc.) must be deferred to {@link commitMount}.
     *
     * Typical work done here includes:
     * - Attaching event listeners.
     * - Setting attributes or layout properties that depend on children.
     * - Performing lightweight state initialization on the host instance.
     *
     * Returns true if {@link commitMount} should be called afterwards.
     *
     * @param instance The primitive instance being finalized.
     * @param type The component type.
     * @param props The component props.
     * @param rootContainer The root container.
     * @param hostContext The host context.
     * @returns True if commitMount should be called; otherwise, false.
     */
    finalizeInitialChildren(
        _instance: HostInstance,
        _type: ComponentType,
        _props: ComponentProps,
        _rootContainer: HostContainer,
        _hostContext: HostContext
    ): boolean {
        return false;   // For now this is a no-op
    }

    /**
     * Append a child host instance to a parent component. This is called
     * during updates to add new child components to existing parents.
     *
     * @param parent The parent host instance to append the child to.
     * @param child The child host instance to append.
     */
    appendChild(parent: HostInstance, child: HostInstance): void {

        const component = this.#bridge.getComponent(parent);

        // Ensure parent is a container
        if (!(component instanceof Container)) {
            throw new TypeError("Cannot append child to non-container component.");
        }

        // Replicate the relationship on the component model
        (component as Container).appendChild(
            this.#bridge.getComponent(child)!
        );

        // Delegate to the renderer
        this.#renderer.appendInitialChild(parent, child);
    }

    /**
     * Insert a child host instance before another child in a parent component.
     * This is called during updates to insert new child components at
     * specific positions within existing parents.
     *
     * @param parent The parent instance to insert the child into.
     * @param child The child instance to insert.
     * @param beforeChild The existing child instance to insert before.
     */
    insertBefore(
        parent: HostInstance,
        child: HostInstance,
        beforeChild: HostInstance
    ): void {

        const component = this.#bridge.getComponent(parent);

        // Ensure parent is a container
        if (!(component instanceof Container)) {
            throw new TypeError("Cannot insert child into non-container component.");
        }

        // Replicate the relationship on the component model
        (component as Container).insertChildBefore(
            this.#bridge.getComponent(child)!,
            this.#bridge.getComponent(beforeChild)!
        );

        // Delegate to the renderer
        this.#renderer.insertBefore(parent, child, beforeChild);
    }

    /**
     * Remove a child host instance from a parent. This is called during
     * updates to remove child components from existing parents.
     *
     * @param parent The parent instance to remove the child from.
     * @param child The child instance to remove.
     */
    removeChild(parent: HostInstance, child: HostInstance): void {

        const component = this.#bridge.getComponent(parent);

        // Ensure parent is a container
        if (!(component instanceof Container)) {
            throw new TypeError("Cannot remove child from non-container component.");
        }

        // Replicate the relationship on the component model
        (component as Container).removeChild(
            this.#bridge.getComponent(child)!
        );

        // Delegate to the renderer
        this.#renderer.removeChild(parent, child);
    }

    /**
     * Reset the text content of a component instance. This is called when
     * the text content needs to be replaced entirely, such as when a
     * Content component's children change from one string to another.
     * 
     * @param instance The Content instance to update.
     */
    resetTextContent(_instance: HostInstance): void {

        // No-op since text updates are driven entirely by component state
        // rather than through React’s text reconciliation in Crucible UI.
        throw new Error("resetTextContent is not supported in Crucible UI.");
    }

    /**
     * Prepare the host environment for committing updates to the component
     * tree. This method is called before any changes are applied to the
     * tree and should be used to preserve any necessary state in the host
     * environment, such as scroll positions, focus states, or selection
     * ranges. The preserved state can then be restored in {@link resetAfterCommit}.
     *
     * @param containerInfo The host container being updated.
     */
    prepareForCommit(_containerInfo: HostContainer): Record<string, unknown> | null {
        return null; // No-op for now
    }

    /**
     * Reset the host environment after committing updates to the component
     * tree. This method is called after all changes have been applied to the
     * tree and should be used to restore any state that was preserved in
     * {@link prepareForCommit}, such as scroll positions, focus states, or
     * selection ranges.
     *
     * @param containerInfo The host container that was updated.
     */
    resetAfterCommit(_containerInfo: HostContainer): void {
        // No-op for now
    }

    /**
     * This function is called to commit an update to a component instance.
     * It applies the changes described in the update payload to the
     * component. However, in Crucible UI, props are immutable and cannot
     * be changed after instantiation, so this function is a no-op.
     *
     * @param instance The component instance being updated.
     * @param type The component type.
     * @param oldProps The previous props of the component.
     * @param newProps The new props to update the component with.
     * @param internalHandle An internal handle used by React Reconciler. The
     *                       type is unknown to prevent leaking react types.
     */
    commitUpdate(
        _instance: HostInstance,
        _type: ComponentType,
        _oldProps: ComponentProps,
        _newProps: ComponentProps,
        _internalHandle: unknown
    ): void {

        // No-op since props are immutable and cannot be changed after
        // instantiation in Crucible UI.
        throw new Error("commitUpdate is not supported in Crucible UI.");
    }

    /**
     * This function is called to commit an update to a text instance by
     * changing its text content. This is called during updates when the text
     * content of a text node needs to be changed. However, in Crucible UI,
     * text updates are driven entirely by component state rather than through
     * React’s text reconciliation. As a result, this method performs no
     * operation. Text changes must be applied through setState or other
     * renderer-managed state transitions, not by the reconciler.
     *
     * @param textInstance The text instance being updated.
     * @param oldText The previous text content.
     * @param newText The new text content to set.
     */
    commitTextUpdate(
        _textInstance: HostTextInstance,
        _oldText: string,
        _newText: string
    ): void {

        // No-op since text updates are driven entirely by component state
        // rather than through React’s text reconciliation in Crucible UI.
        throw new Error("commitTextUpdate is not supported in Crucible UI.");
    }

    /**
     * Perform any necessary actions after a component has been mounted.
     * This is called after the component and all its children have been
     * attached to the tree and are visible. Typical work done here
     * includes setting focus, starting animations, or other actions
     * that require the component to be part of the committed tree.
     *
     * @param instance The host instance that was mounted.
     * @param type The component type.
     * @param props The component props.
     * @param internalHandle An internal handle used by React Reconciler. The
     *                       type is unknown to prevent leaking react types.
     */
    commitMount(
        instance: HostInstance,
        type: ComponentType,
        props: ComponentProps,
        _internalHandle: unknown
    ): void {

        // Propagate to the renderer, but without the internal handle
        this.#renderer.commitMount(
            instance,
            type,
            props
        );
    }

    /**
     * Append a child host instance to the host container during mounting.
     *
     * @param container The host container to append the child to.
     * @param child The child instance to append.
     */
    appendChildToContainer(
        container: HostContainer,
        child: HostInstance
    ): void {

        const component = this.#bridge.getComponent(child);

        // Track root components
        this.#rootComponents.push(component);

        // Delegate to the renderer
        this.#renderer.appendChildToContainer(container, child);
    }

    /**
     * Insert a child instance before another child in the host container.
     * Called during mounting to insert top-level instances at specific
     * positions within the host container.
     *
     * @param container The host container to insert the child into.
     * @param child The child instance to insert.
     * @param beforeChild The existing child instance to insert before.
     */
    insertInContainerBefore(
        container: HostContainer,
        child: HostInstance,
        beforeChild: HostInstance
    ): void {

        const component = this.#bridge.getComponent(child);
        const beforeComponent = this.#bridge.getComponent(beforeChild);

        // Ensure beforeChild is a root component
        const index = this.#rootComponents.indexOf(beforeComponent);

        if (index === -1) {
            throw new TypeError("The reference component to insert before is not a root component.");
        }

        // Track root components
        this.#rootComponents.splice(index, 0, component);

        // Delegate to the renderer
        this.#renderer.insertInContainerBefore(
            container,
            child,
            beforeChild
        );
    }

    /**
     * Remove a child instance from the host container. Called during unmounting
     * to remove top-level instances from the container.
     *
     * @param container The host container to remove the child from.
     * @param child The child instance to remove.
     */
    removeChildFromContainer(container: HostContainer, child: HostInstance): void {

        const component = this.#bridge.getComponent(child);

        // Ensure child is a root component
        const index = this.#rootComponents.indexOf(component);

        if (index === -1) {
            throw new TypeError("Cannot remove non-root component from container.");
        }

        // Remove from root components
        this.#rootComponents.splice(index, 1);

        // Delegate to the renderer
        this.#renderer.removeChildFromContainer(container, child);
    }

    /**
     * Clear all content from the host container. Called to remove all instances
     * from the host container, typically during unmounting or reinitialization.
     *
     * @param container The host container to clear.
     */
    clearContainer(container: HostContainer): void {

        // Clear root components
        this.#rootComponents.length = 0;

        // Delegate to the renderer
        this.#renderer.clearContainer(container);
    }

    /**
     * Returns the React Reconciler host configuration for Crucible UI. This
     * host configuration defines how React should create, update, and manage
     * components within the Crucible UI environment, delegating platform-specific
     * rendering details to the renderer.
     *
     * @param renderer The renderer implementation to use for host operations.
     * @returns A HostConfig object for React Reconciler.
     */
    get hostConfig(): unknown {

        const hostConfig = {

            // Feature flags
            supportsMutation: this.supportsMutation,
            supportsPersistence: this.supportsPersistence,
            supportsHydration: this.supportsHydration,
            isPrimaryRenderer: this.isPrimaryRenderer,

            // Core lifecycle methods
            getRootHostContext: this.#renderer.getRootHostContext.bind(this.#renderer),
            getChildHostContext: this.#renderer.getChildHostContext.bind(this.#renderer),
            shouldSetTextContent: this.shouldSetTextContent.bind(this),
            createInstance: this.createInstance.bind(this),
            createTextInstance: this.createTextInstance.bind(this),
            getPublicInstance: this.getPublicInstance.bind(this),

            // Mount methods (called during first render)
            appendInitialChild: this.appendInitialChild.bind(this),
            finalizeInitialChildren: this.finalizeInitialChildren.bind(this),

            // Container bridge methods (mutation)
            appendChild: this.appendChild.bind(this),
            insertBefore: this.insertBefore.bind(this),
            removeChild: this.removeChild.bind(this),
            resetTextContent: this.resetTextContent.bind(this),

            // Commit phase methods (called during updates)
            prepareForCommit: this.prepareForCommit.bind(this),
            resetAfterCommit: this.resetAfterCommit.bind(this),
            commitUpdate: this.commitUpdate.bind(this), // No-op
            commitTextUpdate: this.commitTextUpdate.bind(this), // No-op
            commitMount: this.commitMount.bind(this),

            // Bridge with native container (mutation)
            appendChildToContainer: this.appendChildToContainer.bind(this),
            insertInContainerBefore: this.insertInContainerBefore.bind(this),
            removeChildFromContainer: this.removeChildFromContainer.bind(this),
            clearContainer: this.clearContainer.bind(this),

            // Suspense methods
            hideInstance: notSupportedYet,
            unhideInstance: notSupportedYet,
            hideTextInstance: notSupportedYet,
            unhideTextInstance: notSupportedYet,

            // Others
            NotPendingTransition: null,
            HostTransitionContext: {} as unknown, //as ReactReconciler.ReactContext<never>,
            noTimeout: 0,
            preparePortalMount: notSupportedYet,
            scheduleTimeout: notSupportedYet as unknown as (_fn: (...args: unknown[]) => unknown, _delay?: number) => number,
            cancelTimeout: notSupportedYet as unknown as (_id: number) => void,
            getInstanceFromNode: notSupportedYet as unknown, //as (_node: any) => ReactReconciler.Fiber | null | undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
            beforeActiveInstanceBlur: notSupportedYet,
            afterActiveInstanceBlur: notSupportedYet,
            prepareScopeUpdate: notSupportedYet as unknown as (_scopeInstance: any, _instance: any) => void, // eslint-disable-line @typescript-eslint/no-explicit-any
            getInstanceFromScope: notSupportedYet as unknown as (_scopeInstance: any) => HostInstance | null, // eslint-disable-line @typescript-eslint/no-explicit-any
            detachDeletedInstance: notSupportedYet as unknown as (_node: HostInstance) => void,
            setCurrentUpdatePriority: notSupportedYet as unknown, // as (_newPriority: ReactReconciler.EventPriority) => void,
            getCurrentUpdatePriority: notSupportedYet as unknown, // as () => ReactReconciler.EventPriority,
            resolveUpdatePriority: notSupportedYet as unknown, // as () => ReactReconciler.EventPriority,
            resetFormInstance: notSupportedYet as unknown as (_form: never) => void,
            requestPostPaintCallback: notSupportedYet as unknown as (_callback: (time: number) => void) => void,
            shouldAttemptEagerTransition: notSupportedYet as unknown as () => boolean,
            trackSchedulerEvent: notSupportedYet as unknown as () => void,
            resolveEventType: notSupportedYet as unknown as () => null | string,
            resolveEventTimeStamp: notSupportedYet as unknown as () => number,
            maySuspendCommit: notSupportedYet as unknown as (_type: ComponentType, _props: ComponentProps) => boolean,
            preloadInstance: notSupportedYet as unknown as (_type: ComponentType, _props: ComponentProps) => boolean,
            startSuspendingCommit: notSupportedYet as unknown as () => void,
            suspendInstance: notSupportedYet as unknown as (_type: ComponentType, _props: ComponentProps) => void,
            waitForCommitToBeReady: notSupportedYet as unknown as () => ((initiateCommit: (...args: unknown[]) => unknown) => (...args: unknown[]) => unknown) | null
        } as ReactReconciler.HostConfig<
            ComponentType,     // Constructor for component types
            ComponentProps,    // Object describing component props
            HostContainer,     // Top-level rendering target the renderer mounts into
            HostInstance,      // Host element representing components
            HostTextInstance,  // Host element representing text nodes
            never,             // Host object used to hide/show Suspense boundaries
            never,             // Host node type used for SSR hydration (not supported)
            never,             // Host object used for form controls (not supported)
            Component,         // The object exposed via ref.current
            HostContext,       // Contextual info propagated down the host tree
            never,             // ChildSet type for persistence (not supported)
            number,            // Return type of platform's timeout API
            number,            // Sentinel type for no timeout
            never              // Transition status (not used)
        >;

        return hostConfig as unknown;
    }
}

/**
 * Placeholder function for methods not yet supported.
 */
function notSupportedYet(): void {
    throw new Error("This method is not supported yet in Crucible UI.");
}

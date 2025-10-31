import type ReactReconciler from 'react-reconciler';
import type { Renderer } from './Renderer';
import { Bridge } from './Bridge';
import {
    type ComponentType,
    type ComponentProps,
    type Container,
    type ContentProps,
    type Component,
    isContainer,
    Content,
    isContent,
} from './components';

/**
 * Reconciler class that integrates React Reconciler with Crucible UI's
 * rendering system. This class manages the reconciliation process, delegating
 * platform-specific rendering tasks to the provided Renderer implementation.
 * It defines how components are created, updated, and managed within the
 * Crucible UI environment.
 */
export class Reconciler<
    HostInstance extends object,    // Native element (e.g., HTMLElement, CanvasNode)
    HostText extends HostInstance,  // Native text node
    HostContainer extends object,   // Root container (e.g., Document, CanvasRoot)
    HostContext extends object,     // Renderer context object
    RendererType extends Renderer<
        HostInstance,
        HostContainer,
        HostContext
    >
> {
    /**
     * The renderer implementation used by this reconciler. The renderer is
     * responsible for creating and managing host instances, handling
     * platform-specific rendering details.
     */
    private readonly _renderer: RendererType;

    /**
     * The bridge associating components with their host instances.
     */
    private readonly _bridge: Bridge<HostInstance, Component>;

    /**
     * The set of root components managed by this reconciler. These components
     * correspond to the top-level elements rendered into the host container.
     */
    private readonly _rootComponents: Component[];

    /**
     * Constructs a new Reconciler with the given renderer.
     */
    constructor(renderer: RendererType) {
        this._renderer = renderer;
        this._bridge = new Bridge<HostInstance, Component>();
        this._rootComponents = [];
    }

    /**
     * Returns the renderer implementation used by this reconciler. This
     * renderer is responsible for creating and managing host instances,
     * handling platform-specific rendering details.
     *
     * @returns The renderer instance.
     */
    protected get renderer(): RendererType {
        return this._renderer;
    }

    /**
     * Returns the bridge associating components with their host instances. This
     * bridge maintains the relationships between Crucible UI components and
     * their corresponding native UI elements in the host environment.
     *
     * @returns The bridge instance.
     */
    private get bridge(): Bridge<HostInstance, Component> {
        return this._bridge;
    }

    /**
     * Returns the set of root components managed by this reconciler. These
     * components correspond to the top-level elements rendered into the host
     * container.
     *
     * @returns The set of root components.
     */
    private get rootComponents(): Component[] {
        return this._rootComponents;
    }

    /**
     * Indicates whether this host configuration supports mutation of the
     * component tree. When true, React Reconciler will call mutation
     * methods (e.g., appendChild, removeChild) to update the tree in place.
     * When false, persistence methods (e.g., cloneInstance) would be used
     * instead to create new versions of components without mutating existing
     * ones. Crucible UI uses mutation.
     *
     * @returns True if mutation is supported; otherwise, false.
     */
    get supportsMutation(): boolean {
        return true;
    }

    /**
     * Indicates whether this host configuration supports hydration of
     * server-rendered content. When true, React Reconciler will attempt to
     * reuse existing host instances rendered on the server instead of
     * creating new ones. When false, hydration is not supported and all
     * content is rendered from scratch on the client.
     *
     * @returns True if hydration is supported; otherwise, false.
     */
    get supportsHydration(): boolean {
        return false;   // Not supported yet
    }

    /**
     * Indicates whether this renderer should be treated as the primary
     * renderer when multiple renderers are used in the same application.
     * When true, this renderer will be prioritized for rendering tasks
     * and event handling. Crucible UI is designed to be the primary
     * renderer in its environment.
     *
     * @returns True if this is the primary renderer; otherwise, false.
     */
    get isPrimaryRenderer(): boolean {
        return true;
    }

    /**
     * Indicates whether this host configuration supports persistence of
     * the component tree. When true, React Reconciler will call persistence
     * methods (e.g., cloneInstance) to create new versions of components
     * without mutating existing ones. When false, mutation methods
     * (e.g., appendChild, removeChild) are used to update the tree in place.
     * Crucible UI uses mutation and does not support persistence.
     *
     * @returns True if persistence is supported; otherwise, false.
     */
    get supportsPersistence(): boolean {
        return false;
    }

    /**
     * Determines whether a component type should receive text content
     * directly through its constructor instead of having React create
     * separate text instances. This is used to support components that
     * are designed to encapsulate text content, such as Content.
     *
     * When this method returns true for a component type, React will
     * pass text content as part of the component's props during
     * instantiation. When false, React will create separate text
     * instances for any text content within the component.
     * 
     * @param type The component type being evaluated.
     * @param props The props of the component being evaluated.
     * @returns True if the component should receive text content directly;
     *          otherwise, false.
     */
    shouldSetTextContent(
        type: ComponentType,
        _props: ComponentProps
    ): boolean {
        return type.isContent === true;
    }
    /**
     * Create an instance of a component for the given type and props. This
     * method is called when React encounters a JSX element and needs to
     * create the corresponding component instance. The returned instance
     * will be used in the component tree and managed by React.
     *
     * @param type The type of the component to create.
     * @param props The props to initialize the component with.
     * @param rootContainer The root container being rendered into.
     * @param hostContext The host context for the component.
     * @param internalHandle An internal handle used by React Reconciler.
     * @returns The created component instance.
     */
    createInstance(
        type: ComponentType,
        props: ComponentProps,
        rootContainer: HostContainer,
        hostContext: HostContext,
        _internalHandle: ReactReconciler.OpaqueHandle
    ): HostInstance {

        // Instantiate
        const component = new type({ ...props });
        const instance = this.renderer.createInstance(component, rootContainer, hostContext);

        // Associate
        this.bridge.set(component, instance);

        return instance;
    }

    /**
     * Create a text instance to represent bare text content within the
     * component tree. This method is called when React encounters text
     * nodes in JSX (e.g., <View>Hello</View>) and the parent component
     * does not handle text content directly. The returned text instance
     * will be used to manage and render the text content within the tree.
     * 
     * @param text The text content to create an instance for.
     * @param rootContainer The root container being rendered into.
     * @param hostContext The host context for the text instance.
     * @param internalHandle An internal handle used by React Reconciler.
     * @returns The created text instance.
     */
    createTextInstance(
        text: string,
        rootContainer: HostContainer,
        hostContext: HostContext,
        _internalHandle: ReactReconciler.OpaqueHandle
    ): HostText {
        return this.createInstance(
            Content,
            { children: text } as ContentProps,
            rootContainer,
            hostContext,
            _internalHandle
        ) as HostText;
    }

    /**
     * This function is called when a component's props change to determine
     * if an update is needed. It's supposed to compare the old and new props
     * and return an update payload describing the changes. However, in
     * Crucible UI, props are immutable, so this function always returns null.
     *
     * @param instance The component instance being updated.
     * @param type The type of the component.
     * @param oldProps The previous props of the component.
     * @param newProps The new props to update the component with.
     * @param rootContainer The root container being rendered into.
     * @param hostContext The host context for the component.
     * @returns null.
     */
    prepareUpdate(
        _instance: Component,
        _type: ComponentType,
        _oldProps: ComponentProps,
        _newProps: ComponentProps,
        _rootContainer: HostContainer,
        _hostContext: HostContext
    ): null {
        return null;
    }

    /**
     * Get the public instance exposed to refs for a given component
     * instance. This method allows the host configuration to control
     * what is returned when a ref is attached to a component.
     *
     * @param instance The component instance.
     * @returns The public instance exposed to refs.
     */
    getPublicInstance(instance: HostInstance): Component {
        return this.bridge.getComponent(instance)!;
    }

    /**
     * Append an initial child to a parent host instance. This is called
     * during the initial rendering phase to build up the component tree.
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
     * animation, etc.) must be deferred to commitMount.
     *
     * Typical work done here includes:
     * - Attaching event listeners.
     * - Setting attributes or layout properties that depend on children.
     * - Performing lightweight state initialization on the host instance.
     *
     * Returns true if commitMount should be called afterwards.
     *
     * @param instance The component instance being finalized.
     * @param type The component type.
     * @param props The component props.
     * @param rootContainer The root container.
     * @param hostContext The host context.
     * @returns True if commitMount should be called; otherwise, false.
     */
    finalizeInitialChildren(
        instance: HostInstance,
        type: ComponentType,
        props: ComponentProps,
        rootContainer: HostContainer,
        hostContext: HostContext
    ): boolean {

        // For now we just delegate to the renderer, but this could
        // include additional logic in the future, such as setting
        // up event listeners or performing other initialization.
        return this.renderer.finalizeInitialChildren(
            instance,
            type,
            props,
            rootContainer,
            hostContext
        );
    }

    /**
     * Append a child host instance to a parent component. This is called
     * during updates to add new child components to existing parents.
     *
     * @param parent The parent host instance to append the child to.
     * @param child The child host instance to append.
     */
    appendChild(parent: HostInstance, child: HostInstance): void {

        // Replicate the relationship on the component model
        assertContainer(this.bridge.getComponent(parent)!).appendChild(
            this.bridge.getComponent(child)!
        );

        // Delegate to the renderer
        this.renderer.appendInitialChild(parent, child);
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

        // Replicate the relationship on the component model
        assertContainer(this.bridge.getComponent(parent)!).insertChildBefore(
            this.bridge.getComponent(child)!,
            this.bridge.getComponent(beforeChild)!
        );

        // Delegate to the renderer
        this.renderer.insertBefore(parent, child, beforeChild);
    }

    /**
     * Remove a child host instance from a parent component. This is called
     * during updates to remove child components from existing parents.
     *
     * @param parent The parent instance to remove the child from.
     * @param child The child instance to remove.
     */
    removeChild(parent: HostInstance, child: HostInstance): void {

        // Replicate the relationship on the component model
        assertContainer(this.bridge.getComponent(parent)!).removeChild(
            this.bridge.getComponent(child)!
        );

        // Delegate to the renderer
        this.renderer.removeChild(parent, child);
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
    }

    /**
     * This function is called to commit an update to a component instance.
     * It applies the changes described in the update payload to the
     * component. However, in Crucible UI, props are immutable and cannot
     * be changed after instantiation, so this function is a no-op.
     *
     * @param instance The component instance being updated.
     * @param updatePayload The payload describing what changed.
     * @param type The component type.
     * @param oldProps The previous props of the component.
     * @param newProps The new props to update the component with.
     * @param internalHandle An internal handle used by React Reconciler.
     */
    commitUpdate(
        _instance: HostInstance,
        _updatePayload: null,
        _type: ComponentType,
        _oldProps: ComponentProps,
        _newProps: ComponentProps,
        _internalHandle: ReactReconciler.OpaqueHandle
    ): void {
        // No-op since props are immutable and cannot be changed after
        // instantiation in Crucible UI.
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
        _textInstance: HostText,
        _oldText: string,
        _newText: string
    ): void {
        // No-op since text updates are driven entirely by component state
        // rather than through React’s text reconciliation in Crucible UI.
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

        // Track root component
        this.rootComponents.push(
            this.bridge.getComponent(child)!
        );

        // Delegate to the renderer
        this.renderer.appendChildToContainer(container, child);
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

        // Track root component
        this.rootComponents.splice(
            this.rootComponents.indexOf(
                this.bridge.getComponent(beforeChild)!
            ),
            0,
            this.bridge.getComponent(child)!
        );

        // Delegate to the renderer
        this.renderer.insertInContainerBefore(
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

        // Remove from root components
        const component = this.bridge.getComponent(child)!;
        const index = this.rootComponents.indexOf(component);

        this.rootComponents.splice(index, 1);

        // Delegate to the renderer
        this.renderer.removeChildFromContainer(container, child);
    }

    /**
     * Clear all content from the host container. Called to remove all instances
     * from the host container, typically during unmounting or reinitialization.
     *
     * @param container The host container to clear.
     */
    clearContainer(container: HostContainer): void {

        // Clear root components
        this.rootComponents.length = 0;

        // Delegate to the renderer
        this.renderer.clearContainer(container);
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
    get reconciler(): ReactReconciler.HostConfig<
        ComponentType,     // Constructor for component types
        ComponentProps,    // Object describing component props
        HostContainer,     // Top-level rendering target the renderer mounts into
        HostInstance,      // Concrete host element representing components
        HostText,          // Concrete host element representing text nodes
        never,             // Host object used to hide/show Suspense boundaries
        never,             // Host node type used for SSR hydration (not supported)
        Component,         // The object exposed via ref.current
        HostContext,       // Contextual info propagated down the host tree
        never,             // The diff object describing updates (props are immutable)
        never,             // Data structure for persistence mode (off-screen clones of children)
        number,            // Return type of platform's timeout API
        number             // Sentinel type for no timeout
    > {
        return {

            // Feature flags
            supportsMutation: this.supportsMutation,
            supportsPersistence: this.supportsPersistence,
            supportsHydration: this.supportsHydration,
            isPrimaryRenderer: this.isPrimaryRenderer,

            // Core lifecycle methods
            getRootHostContext: this.renderer.getRootHostContext.bind(this.renderer),
            getChildHostContext: this.renderer.getChildHostContext.bind(this.renderer),
            shouldSetTextContent: this.shouldSetTextContent.bind(this),
            createInstance: this.createInstance.bind(this),
            createTextInstance: this.createTextInstance.bind(this),
            prepareUpdate: this.prepareUpdate.bind(this),
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
            prepareForCommit: this.renderer.prepareForCommit.bind(this.renderer),
            resetAfterCommit: this.renderer.resetAfterCommit.bind(this.renderer),
            commitUpdate: this.commitUpdate.bind(this),         // No-op
            commitTextUpdate: this.commitTextUpdate.bind(this), // No-op
            commitMount: (
                instance: HostInstance,
                type: ComponentType,
                props: ComponentProps,
                _internalHandle: ReactReconciler.OpaqueHandle
            ): void => {

                // Propagate to the renderer, but without the internal handle
                this.renderer.commitMount(
                    instance,
                    type,
                    props
                );
            },

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
        };
    }
}

/**
 * Asserts that a component is a container component.Used before performing
 * operations specific to container components.Throws if the check fails.
 * 
 * @param instance The component instance to check.
 * @returns The instance typed as Container if the check passes.
 * @throws Error if the instance is not a container component.
 */
export function assertContainer(instance: Component): Container {
    if (!isContainer(instance)) {
        throw new Error(
            "Non-container component does not support children."
        );
    }
    return instance;
}

/**
 * Asserts that a component is a Content component. Used before performing
 * operations specific to Content components. Throws if the check fails.
 * 
 * @param instance The component instance to check.
 * @returns The instance typed as Content if the check passes.
 * @throws Error if the instance is not a Content component.
 */
export function assertContent(instance: Component): Content {
    if (isContent(instance) === false) {
        throw new Error(
            "Text nodes must be created via Content; other components cannot contain text."
        );
    }
    return instance;
}

/**
 * Placeholder function for methods not yet supported.
 */
function notSupportedYet(): void {
    // Not supported yet
}

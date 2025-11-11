import ReactReconciler from 'react-reconciler';
import { Reconciler } from '../Reconciler';
import type { Renderer } from "./Renderer";
import type { Manifest } from './Manifest';
import {
    type Element,
    type Composite,
    type CompositeProps,
    createElement
} from "../elements";
import type {
    Intent,
    IntentProps,
    IntentState,
    IntentType
} from "../intents";

/**
 * The {@link Host} class represents the runtime bridge between Crucible’s
 * abstract intent model and a specific rendering backend.
 *
 * It coordinates the {@link Renderer}, {@link Reconciler}, and React’s internal
 * Fiber reconciler to execute and render Crucible widgets.
 *
 * @typeParam HostInstance - The renderer’s concrete renderable unit (e.g., a DOM element).
 * @typeParam HostContainer - The container surface onto which widgets are rendered.
 * @typeParam HostContext - The context propagated through the host environment.
 */
export class Host<
    HostContainer extends object,
    HostInstance extends object
> {

    /**
     * Renderer responsible for creating and mutating host instances.
     * 
     * Implements the {@link Renderer} interface for the specific host platform,
     * defining how intents are instantiated, updated, and managed within the
     * host environment.
     */
    readonly #renderer: Renderer<
        HostContainer,
        HostInstance
    >;

    /**
     * Crucible reconciler that implements host configuration.
     * 
     * Coordinates with the {@link Renderer} to apply updates to the host
     * environment based on changes in the intent tree.
     */
    readonly #reconciler: Reconciler<
        HostContainer,
        HostInstance
    >;

    /**
     * React reconciler instance configured with Crucible’s host implementation.
     * 
     * Uses React’s internal reconciler to manage the rendering lifecycle,
     * delegating actual instance creation and updates to the {@link Reconciler}
     * and {@link Renderer}. The type is `unknown` to avoid exposing React internals.
     */
    readonly #reactReconciler: unknown;

    /**
     * Creates a new {@link Host} instance.
     *
     * @param renderer - The platform-specific renderer responsible for instance
     *                   creation and updates.
     */
    constructor(
        renderer: Renderer<
            HostContainer,
            HostInstance
        >,
    ) {
        this.#renderer = renderer;

        this.#reconciler = new Reconciler<HostContainer, HostInstance>(this.#renderer);
        this.#reactReconciler = ReactReconciler(this.#reconciler.hostConfig as ReactReconciler.HostConfig<
            IntentType,     // Constructor for intents types
            IntentProps,    // Object describing intents props
            HostContainer,  // Top-level rendering target the renderer mounts into
            HostInstance,   // Host instance type
            never,          // Host element representing text nodes
            never,          // Host object used to hide/show Suspense boundaries
            never,          // Host node type used for SSR hydration (not supported)
            never,          // Host object used for form controls (not supported)
            Intent,         // The object exposed via ref.current
            unknown,        // Contextual info propagated down the host tree
            never,          // ChildSet type for persistence (not supported)
            number,         // Return type of platform's timeout API
            number,         // Sentinel type for no timeout
            never           // Transition status (not used)
        >);
    }

    /**
     * Loads and resolves a {@link Manifest} into an array of {@link Composite}
     * widget callbacks.
     *
     * Each widget is dynamically imported from the path specified in the
     * manifest. If the import is successful, the default export is assumed to
     * be a {@link Composite} function. Errors are not handled yet.
     *
     * @param manifest - The widget manifest to load.
     * @returns A Promise resolving to an array of composite widget functions.
     */
    protected async loadManifest(manifest: Manifest): Promise<Composite[]> {

        const widgets = await Promise.all(
            manifest.widgets.map(async (widget) => {

                // Dynamically import the widget module as a Composite
                const module = await import(widget.path) as {
                    default: Composite
                };

                return module.default;
            })
        );

        return widgets;
    }

    /**
     * Handles uncaught errors during rendering.
     *
     * This method is invoked by the React reconciler when an error occurs
     * that is not caught by any error boundary within the intent tree. The
     * default implementation re-throws the error, which for now works just
     * as a placeholder.
     *
     * @param error - The uncaught error that occurred.
     * @param info - Additional information about the error context. The type is
     *               `unknown` to not expose React internals.
     */
    #onUncaughtError(error: Error, _info: unknown): void {
        throw error;
    }

    /**
     * Handles errors caught by error boundaries during rendering.
     *
     * This method is invoked by the React reconciler when an error is caught
     * by an error boundary within the intent tree. The default implementation
     * re-throws the error, which for now works just as a placeholder.
     *
     * @param error - The error that was caught.
     * @param info - Additional information about the error context. The type is
     *               `unknown` to not expose React internals.
     */
    #onCaughtError(error: Error, _info: unknown): void {
        throw error;
    }

    /**
     * Handles recoverable errors during rendering.
     *
     * This method is invoked by the React reconciler when a recoverable error
     * occurs during rendering. The default implementation re-throws the error,
     * which for now works just as a placeholder.
     *
     * @param error - The recoverable error that occurred.
     * @param info - Additional information about the error context. The type is
     *               `unknown` to not expose React internals.
     */
    #onRecoverableError(error: Error, _info: unknown): void {
        throw error;
    }

    /**
     * Handles default transition indicators during rendering.
     *
     * This method is invoked by the React reconciler to indicate the start
     * or end of a transition. The default implementation is a no-op, which
     * for now works just as a placeholder.
     */
    #onDefaultTransitionIndicator(): void {
        // No-op
    }

    /**
     * Renders all widgets defined in a {@link Manifest} into the provided container.
     *
     * Each widget is mounted into an independent React Fiber root, ensuring full
     * isolation of state and lifecycle. The widgets are dynamically loaded via
     * {@link loadManifest} and then instantiated through Crucible’s
     * {@link createElement} factory before being passed to React’s reconciler.
     *
     * @param manifest - The widget manifest describing the intent to render.
     * @param container - The rendering target (e.g., a DOM element).
     * @returns A Promise that resolves once all widgets have been scheduled
     *          for rendering.
     */
    async render(manifest: Manifest, container: HostContainer): Promise<void> {

        // Load the widgets from the manifest (should be a remote request)
        const widgets = await this.loadManifest(manifest);

        // Get the React Reconciler typed instance. By refering the type here,
        // we avoid exposing React internals in the Host class definition.
        const reactReconciler = this.#reactReconciler as ReactReconciler.Reconciler<
            HostContainer,
            HostInstance,
            never,
            never,
            never,
            Intent<IntentProps, IntentState>
        >;

        for (const widget of widgets) {

            // Create a React Reconciler root for the container
            // (Can't figure out where there's an unsafe assignment here)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const root: ReactReconciler.OpaqueRoot = reactReconciler.createContainer(
                container,      // Host container
                0,              // Root tag (0 = Legacy)
                null,           // Hydration callbacks
                false,          // isStrictMode
                false,          // concurrentUpdatesByDefaultOverride
                '',             // identifierPrefix
                this.#onUncaughtError.bind(this),
                this.#onCaughtError.bind(this),
                this.#onRecoverableError.bind(this),
                this.#onDefaultTransitionIndicator.bind(this),
                null            // transitionCallbacks
            ) as ReactReconciler.OpaqueRoot;

            // Create the element from the Composite widget
            const composite: Composite = widget;
            const element: Element = createElement(composite, {} as CompositeProps);

            // Update the container with the element (render the widget)
            reactReconciler.updateContainer(
                element as unknown as React.ReactElement,
                root,
                null,
                () => { /* no-op */ }
            );
        }
    }
}

import type { Component, ComponentProps, ComponentState } from './components';

/**
 * Class representing an association bridge between a Crucible UI component
 * and its corresponding host instance. This bridge maintains the association
 * between the component and the native UI element in the host environment.
 */
export class Pair<
    HostInstanceT,
    ComponentT extends Component<
        PropsT,
        StateT
    >,
    PropsT extends ComponentProps = ComponentProps,
    StateT extends ComponentState = ComponentState
> {
    /**
     * The Crucible UI component associated with the host instance. This
     * property holds a reference to the component that is rendered into the
     * host environment.
     */
    private readonly _component: ComponentT;

    /**
     * The host instance representing the native UI element. This property
     * holds the platform-specific representation of the component in the
     * host environment.
     */
    private readonly _hostInstance: HostInstanceT;

    /**
     * Construct a new Pair instance associating a component and a host instance.
     * 
     * @param component - The Crucible UI component to associate.
     * @param hostInstance - The host instance representing the native UI element.
     */
    constructor(
        component: ComponentT,
        hostInstance: HostInstanceT
    ) {
        this._component = component;
        this._hostInstance = hostInstance;
    }

    /**
     * Get the Crucible UI component associated with this bridge.
     * 
     * @returns The associated component.
     */
    get component(): ComponentT {
        return this._component;
    }

    /**
     * Get the host instance representing the native UI element.
     * 
     * @returns The host instance.
     */
    get hostInstance(): HostInstanceT {
        return this._hostInstance;
    }
}

/**
 * Bridge class that manages associations between Crucible UI components
 * and their corresponding host instances. This class maintains a mapping
 * of component-host instance pairs, allowing for efficient retrieval and
 * management of these associations during the reconciliation process.
 */
export class Bridge<
    HostInstanceT extends object,
    ComponentT extends Component<
        PropsT,
        StateT
    >,
    PropsT extends ComponentProps = ComponentProps,
    StateT extends ComponentState = ComponentState
> {

    /**
     * Map storing the associations between host instances and components. This
     * map allows for efficient lookup of the component-host relationships.
     */
    private readonly _hostToComponentMap: WeakMap<HostInstanceT, Pair<HostInstanceT, ComponentT>>;

    /**
     * Map storing the associations between components and host instances. This
     * map allows for efficient lookup of the component-host relationships.
     */
    private readonly _componentToHostMap: WeakMap<ComponentT, Pair<HostInstanceT, ComponentT>>;

    /**
     * Constructs a new Bridge instance, initializing the internal maps
     * for storing component-host instance associations.
     */
    constructor() {
        this._hostToComponentMap = new WeakMap<HostInstanceT, Pair<HostInstanceT, ComponentT>>();
        this._componentToHostMap = new WeakMap<ComponentT, Pair<HostInstanceT, ComponentT>>();
    }

    /**
     * Register a new association between a Crucible UI component and its
     * corresponding host instance. This method creates a Pair instance to
     * represent the association and stores it in the internal maps. The
     * association is bi-directional.
     * 
     * @param component - The Crucible UI component.
     * @param hostInstance - The host instance.
     * @returns The created Pair instance.
     */
    set(
        component: ComponentT,
        hostInstance: HostInstanceT
    ): Pair<HostInstanceT, ComponentT> {

        const pair = new Pair<HostInstanceT, ComponentT>(
            component,
            hostInstance
        );

        // Associate
        this._hostToComponentMap.set(hostInstance, pair);
        this._componentToHostMap.set(component, pair);

        return pair;
    }

    /**
     * Unregister the association between a Crucible UI component and its
     * corresponding host instance. This method removes the Pair instance
     * from the internal maps, effectively breaking the association. The
     * two parameters must correspond to the same Pair for the removal
     * to succeed. The instance types (component and hostInstance) are
     * validated to ensure they match the stored association.
     */
    unset(
        component: ComponentT,
        hostInstance: HostInstanceT
    ): boolean {

        const componentPair = this._componentToHostMap.get(component);
        const instancePair = this._hostToComponentMap.get(hostInstance);

        if (componentPair === undefined || instancePair === undefined) {
            return false;
        }

        if (componentPair !== instancePair) {
            return false;
        }

        this._componentToHostMap.delete(component);
        this._hostToComponentMap.delete(hostInstance);

        return true;
    }

    /**
     * Retrieve the Pair instance associated with the given Crucible UI component.
     * 
     * @param component - The Crucible UI component.
     * @returns The Pair instance if found; otherwise, undefined.
     */
    getHostInstance(
        component: ComponentT
    ): HostInstanceT | undefined {
        return this._componentToHostMap.get(component)?.hostInstance;
    }

    /**
     * Retrieve the Pair instance associated with the given host instance.
     * 
     * @param hostInstance - The host instance.
     * @returns The Pair instance if found; otherwise, undefined.
     */
    getComponent(
        hostInstance: HostInstanceT
    ): ComponentT | undefined {
        return this._hostToComponentMap.get(hostInstance)?.component;
    }
}

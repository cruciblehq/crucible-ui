import type { Component } from '../components';

/**
 * Couples a Crucible UI component instance with its primitive.
 * 
 * This pairing facilitates the management and synchronization of the
 * component with its underlying primitive representation.
 *
 * @typeParam HostInstance - The primitive object created by the renderer.
 */
export class Pair<HostInstance extends object> {

    /**
     * The Crucible UI component instance.
     */
    readonly component: Component;

    /**
     * The associated primitive produced by the renderer.
     */
    readonly primitive: HostInstance;

    /**
     * Creates a component/primitive pair.
     *
     * @param component - The component instance.
     * @param primitive - The primitive associated with the component.
     */
    constructor(
        component: Component,
        primitive: HostInstance
    ) {
        this.component = component;
        this.primitive = primitive;
    }
}

/**
 * Registry that maps components to their primitives and vice versa.
 * 
 * This data structure maintains a two-way association between Crucible UI
 * component instances and their corresponding primitives created by the
 * renderer. It allows lookup in both directions, enabling synchronization
 * and management of component/primitive relationships.
 *
 * @typeParam HostInstance - The primitive object created by the renderer.
 */
export class Bridge<HostInstance extends object> {

    /**
     * Primitive pair mapping.
     * 
     * Maps primitives to their associated component pairs.
     */
    private readonly _primitiveToComponentMap: WeakMap<HostInstance, Pair<HostInstance>>;

    /**
     * Component pair mapping.
     * 
     * Maps components to their associated primitive pairs.
     */
    private readonly _componentToPrimitiveMap: WeakMap<Component, Pair<HostInstance>>;

    /**
     * Constructor.
     * 
     * Initializes empty maps.
     */
    constructor() {
        this._primitiveToComponentMap = new WeakMap<HostInstance, Pair<HostInstance>>();
        this._componentToPrimitiveMap = new WeakMap<Component, Pair<HostInstance>>();
    }

    /**
     * Registers a bi-directional association.
     *
     * If either the component or primitive is already registered, the existing
     * association will be overwritten.
     * 
     * @param component - The component instance.
     * @param primitive - The associated primitive.
     * @returns The created pair.
     */
    set(
        component: Component,
        primitive: HostInstance
    ): Pair<HostInstance> {

        const pair = new Pair(component, primitive);

        // Associate both ways
        this._primitiveToComponentMap.set(primitive, pair);
        this._componentToPrimitiveMap.set(component, pair);

        return pair;
    }

    /**
     * Unregisters a bi-directional association.
     *
     * Both arguments must belong to the same pair. If either the component or
     * primitive does not match the registered pair, the association will not
     * be removed and `false` will be returned.
     *
     * @param component - The component instance.
     * @param primitive - The associated primitive.
     * @returns `true` if removed, `false` if no matching pair existed.
     */
    unset(
        component: Component,
        primitive: HostInstance
    ): boolean {

        // Look up both ways
        const componentPair = this._componentToPrimitiveMap.get(component);
        const instancePair = this._primitiveToComponentMap.get(primitive);

        // Both must exist and match
        if (!componentPair || !instancePair) return false;
        if (componentPair !== instancePair) return false;

        // Remove both ways
        this._componentToPrimitiveMap.delete(component);
        this._primitiveToComponentMap.delete(primitive);

        return true;
    }

    /**
     * Gets the primitive associated with a component.
     * 
     * If the component is not registered, an error is thrown.
     * 
     * @param component - The component instance.
     * @returns The primitive, or `undefined` if none is registered.
     */
    getPrimitive(component: Component): HostInstance {
        const pair = this._componentToPrimitiveMap.get(component);

        if (!pair) {
            throw new Error("No primitive registered for the given component.");
        }

        return pair.primitive;
    }

    /**
     * Gets the component associated with a primitive.
     * 
     * If the primitive is not registered, an error is thrown.
     *
     * @param primitive - The primitive.
     * @returns The component, or `undefined` if none is registered.
     */
    getComponent(primitive: HostInstance): Component {

        const pair = this._primitiveToComponentMap.get(primitive);

        if (!pair) {
            throw new Error("No component registered for the given primitive.");
        }

        return pair.component;
    }
}

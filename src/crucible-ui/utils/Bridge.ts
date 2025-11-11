import type { Intent } from '../intents';

/**
 * Couples a Crucible UI intent instance with its primitive.
 * 
 * This pairing facilitates the management and synchronization of intents with
 * their underlying primitive representations.
 *
 * @typeParam HostInstance - The primitive object created by the renderer.
 */
export class Pair<HostInstance extends object> {

    /**
     * The Crucible UI intent instance.
     */
    readonly intent: Intent;

    /**
     * The associated primitive produced by the renderer.
     */
    readonly primitive: HostInstance;

    /**
     * Creates a intent/primitive pair.
     *
     * @param intent - The intent instance.
     * @param primitive - The primitive associated with the intent.
     */
    constructor(
        intent: Intent,
        primitive: HostInstance
    ) {
        this.intent = intent;
        this.primitive = primitive;
    }
}

/**
 * Registry that maps intents to their primitives and vice versa.
 * 
 * This data structure maintains a two-way association between Crucible UI
 * intent instances and their corresponding primitives created by the
 * renderer. It allows lookup in both directions, enabling synchronization
 * and management of intent/primitive relationships.
 *
 * @typeParam HostInstance - The primitive object created by the renderer.
 */
export class Bridge<HostInstance extends object> {

    /**
     * Maps primitives to their associated intent pairs.
     */
    private readonly _primitiveToIntentMap: WeakMap<HostInstance, Pair<HostInstance>>;

    /**
     * Maps intents to their associated primitive pairs.
     */
    private readonly _intentToPrimitiveMap: WeakMap<Intent, Pair<HostInstance>>;

    /**
     * Initializes empty maps.
     */
    constructor() {
        this._primitiveToIntentMap = new WeakMap<HostInstance, Pair<HostInstance>>();
        this._intentToPrimitiveMap = new WeakMap<Intent, Pair<HostInstance>>();
    }

    /**
     * Registers a bi-directional association.
     *
     * If either the intent or primitive are already registered, the existing
     * association will be overwritten.
     * 
     * @param intent - The intent instance.
     * @param primitive - The associated primitive.
     * 
     * @returns The created pair.
     */
    set(
        intent: Intent,
        primitive: HostInstance
    ): Pair<HostInstance> {

        const pair = new Pair(intent, primitive);

        // Associate both ways
        this._primitiveToIntentMap.set(primitive, pair);
        this._intentToPrimitiveMap.set(intent, pair);

        return pair;
    }

    /**
     * Unregisters a bi-directional association.
     *
     * Both arguments must belong to the same pair. If either the intent or
     * primitive does not match the registered pair, the association will not
     * be removed and `false` will be returned.
     *
     * @param intent - The intent instance.
     * @param primitive - The associated primitive.
     * @returns `true` if removed, `false` if no matching pair existed.
     */
    unset(
        intent: Intent,
        primitive: HostInstance
    ): boolean {

        // Look up both ways
        const intentPair = this._intentToPrimitiveMap.get(intent);
        const instancePair = this._primitiveToIntentMap.get(primitive);

        // Both must exist and match
        if (!intentPair || !instancePair) return false;
        if (intentPair !== instancePair) return false;

        // Remove both ways
        this._intentToPrimitiveMap.delete(intent);
        this._primitiveToIntentMap.delete(primitive);

        return true;
    }

    /**
     * Gets the primitive associated with an intent.
     * 
     * If the intent is not registered, an error is thrown.
     * 
     * @param intent - The intent instance.
     * @returns The primitive, or `undefined` if none is registered.
     */
    getPrimitive(intent: Intent): HostInstance {
        const pair = this._intentToPrimitiveMap.get(intent);

        if (!pair) {
            throw new Error("No primitive registered for the given intent.");
        }

        return pair.primitive;
    }

    /**
     * Gets the intent associated with a primitive.
     * 
     * If the primitive is not registered, an error is thrown.
     *
     * @param primitive - The primitive.
     * @returns The intent, or `undefined` if none is registered.
     */
    getIntent(primitive: HostInstance): Intent {

        const pair = this._primitiveToIntentMap.get(primitive);

        if (!pair) {
            throw new Error("No intent registered for the given primitive.");
        }

        return pair.intent;
    }
}

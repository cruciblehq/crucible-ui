import type { Intent } from "../intents";

/**
 * Type alias for a callback ref to a Crucible UI intent instance.
 * 
 * A callback ref is a function that receives the intent instance when it is
 * mounted or `null` when it is unmounted.
 * 
 * @remarks This mimics React's RefCallback type to prevent leaking React types.
 *
 * @typeParam T - The type of the intent instance.
 */
export type RefCallback<T extends Intent> = {
    bivarianceHack(
        instance: T | null,
    ): void
}["bivarianceHack"];

/**
 * Interface for a ref object to a Crucible UI intent instance.
 * 
 * A ref object has a `current` property that holds the intent instance or
 * `null` if it is not mounted.
 * 
 * @remarks This mimics React's RefObject to prevent leaking React types.
 *
 * @typeParam T - The type of the intent instance.
 */
export interface RefObject<T extends Intent> {
    readonly current: T | null;
};

/**
 * Type alias for a reference to a Crucible UI intent instance.
 * 
 * Crucible UI simply reuses React's {@link Ref} type here since Crucible UI
 * intents are compatible with React refs. This enables both callback refs
 * and ref objects.
 * 
 * @remarks This mimics React's Ref type to prevent leaking React types.
 * 
 * @typeParam T - The type of the intent instance.
 */
export type Ref<T extends Intent> = RefCallback<T> | RefObject<T> | null;
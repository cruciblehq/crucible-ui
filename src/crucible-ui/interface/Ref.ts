import type { Component } from "../components";

/**
 * Type alias for a callback ref to a Crucible UI component instance.
 * 
 * A callback ref is a function that receives the component instance when it
 * is mounted or `null` when it is unmounted.
 * 
 * @remarks This mimics React's RefCallback type to prevent leaking React types.
 *
 * @typeParam T - The type of the component instance.
 */
export type RefCallback<T extends Component> = {
    bivarianceHack(
        instance: T | null,
    ): void
}["bivarianceHack"];

/**
 * Interface for a ref object to a Crucible UI component instance.
 * 
 * A ref object has a `current` property that holds the component instance or
 * `null` if it is not mounted.
 * 
 * @remarks This mimics React's RefObject interface to prevent leaking React types.
 *
 * @typeParam T - The type of the component instance.
 */
export interface RefObject<T extends Component> {
    readonly current: T | null;
};

/**
 * Type alias for a reference to a Crucible UI component instance.
 * 
 * Crucible UI simply reuses React's {@link Ref} type here since Crucible UI
 * components are compatible with React refs. This enables both callback refs
 * and ref objects.
 * 
 * @remarks This mimics React's Ref type to prevent leaking React types.
 * 
 * @typeParam T - The type of the component instance.
 */
export type Ref<T extends Component> = RefCallback<T> | RefObject<T> | null;

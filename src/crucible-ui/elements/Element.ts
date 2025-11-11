import type { Ref } from '../interface';
import type {
    Intent,
    IntentProps,
    IntentState,
    IntentType,
    LayoutProps,
    LayoutState,
    LayoutType,
} from '../intents';

/**
 * Base structural type for all Crucible elements.
 *
 * Crucible elements are immutable descriptions of intent instances, analogous
 * to React elements but designed for Crucible’s intent model. They are produced
 * by element factory functions (e.g., {@link createElement}) and consumed by
 * the Crucible reconciler to construct live intent instances.
 *
 * Crucible follows React’s element object shape for interoperability but
 * introduces the internal `__crucible_ctor` property to retain the actual
 * constructor. The public `type` field remains a string so that React treats
 * Crucible elements as host primitives and delegates them to Crucible’s reconciler.
 *
 * @typeParam T - The constructor type of the Crucible intent class.
 */
type ElementBase<T extends abstract new (...args: any[]) => Intent> = { // eslint-disable-line @typescript-eslint/no-explicit-any

    /**
     * The React element type marker symbol. Identifies this object as a valid
     * React-compatible element at runtime.
     */
    readonly $$typeof: symbol;

    /**
     * The Crucible intent constructor for this element. Retained internally
     * to instantiate the correct intent class during reconciliation.
     */
    readonly __crucible_ctor: T;

    /**
     * The public element type name. Always a string to ensure that React’s
     * reconciler treats Crucible elements as host primitives and passes
     * them to Crucible’s custom renderer. The actual constructor is stored
     * in `__crucible_ctor`.
     */
    readonly type: string;

    /**
     * Optional key used to identify this element within its parent. Preserved
     * for React compatibility.
     */
    readonly key?: string;

    /**
     * Optional reference to the live component instance once created. Used to
     * support ref forwarding.
     */
    readonly ref?: Ref<Intent>;

    /**
     * The props used to configure the component instance represented by
     * the element. Derived from the component’s prop type definition.
     */
    readonly props: InstanceType<T>["props"];
};

/**
 * Represents a Crucible element describing an intent instance.
 *
 * This corresponds to the basic form of a JSX element (e.g., `<Input>`). The
 * element is immutable and contains all the information necessary for the
 * reconciler to create and manage the corresponding live component.
 *
 * @typeParam ComponentPropsT - The type of the props accepted by the intent.
 * @typeParam ComponentStateT - The type of the state maintained by the intent.
 * @typeParam ComponentT - The constructor type of the intent represented.
 */
export type Element<
    IntentPropsT extends IntentProps = IntentProps,
    IntentStateT extends IntentState = IntentState,
    IntentTypeT extends IntentType<IntentPropsT, IntentStateT> = IntentType<IntentPropsT, IntentStateT>
> = ElementBase<IntentTypeT>;

/**
 * Represents a Crucible element describing a layout container intent.
 *
 * Layouts can hold child elements within their props. Each child is itself a
 * Crucible element, forming a recursive element tree structure. This mirrors
 * React’s convention of defining `children` as part of props, even though
 * Crucible’s runtime treats children as separate entities.
 *
 * @typeParam LayoutPropsT - The type of the props accepted by the layout.
 * @typeParam LayoutStateT - The type of the state maintained by the layout.
 * @typeParam LayoutT - The constructor type of the layout represented.
 */
export type LayoutElement<
    LayoutPropsT extends LayoutProps = LayoutProps,
    LayoutStateT extends LayoutState = LayoutState,
    LayoutTypeT extends LayoutType<LayoutPropsT, LayoutStateT> = LayoutType<LayoutPropsT, LayoutStateT>
> = ElementBase<LayoutTypeT> & {

    props: LayoutPropsT & {

        /**
         * The child elements contained within this container. Each child is
         * itself a Crucible element representing another component.
         *
         * This is an unfortunate inheritance from React’s model where
         * `children` are part of props, even though Crucible treats them as
         * first-class entities in its reconciliation process.
         */
        readonly children: Element<typeof Intent>[];
    }
};

import type {
    Element,
    LayoutElement
} from './Element';
import {
    type Composite,
    type CompositeProps,
    isComposite
} from './Composite';
import {
    type ConcreteIntentType,
    type IntentType,
    type IntentProps,
    type IntentState,
    type LayoutProps,
    type LayoutState,
    type LayoutType,
    Intent,
    Layout,
} from "../intents";

/**
 * Represents a props object that includes Crucible’s internal constructor
 * reference. This is used internally to retain type information about the
 * intent constructor during reconciliation.
 *
 * @typeParam T - The constructor type of the intent.
 */
export interface Ctor<
    T extends new (...args: any[]) => Intent // eslint-disable-line @typescript-eslint/no-explicit-any
> {

    /**
     * The Crucible constructor for the intent associated with this props.
     * Retained internally to instantiate the correct intent class during
     * reconciliation, since the public `type` field is a string. This is a
     * workaround for forcing React to treat Crucible intents as host primitives.
     */
    readonly __crucible_ctor: T;
}

/**
 * Injects Crucible’s internal constructor reference into a props object.
 *
 * This function ensures the given Crucible element carries a reference to its
 * original intent constructor under the `__crucible_ctor` field. This is
 * required because Crucible elements use a string `type` value for React
 * compatibility, which hides the actual class reference that the Crucible
 * reconciler needs during instantiation.
 *
 * @typeParam IntentPropsT - The type of props.
 * @typeParam IntentStateT - The type of state.
 * @typeParam IntentTypeT - The constructor type of the intent.
 * 
 * @param type - The constructor of the Crucible intent.
 * @param props - The props for the intent instance.
 * 
 * @returns A new props object including `__crucible_ctor`.
 */
function injectCrucibleCtor<
    IntentPropsT extends IntentProps,
    IntentStateT extends IntentState,
    IntentTypeT extends ConcreteIntentType<IntentPropsT, IntentStateT>
>(
    type: IntentTypeT,
    props: IntentPropsT
): IntentPropsT & Ctor<IntentTypeT> {

    // This is a security measure to prevent callers from overwriting the
    // internal constructor reference. If __crucible_ctor was defined in the
    // original props, it could indicate an attempt to make Crucible use a
    // different component class than intended, which could lead to
    // unpredictable behavior (e.g., inject code to run outside the SES sandbox).
    if (props && "__crucible_ctor" in props) {
        throw new Error("Props object must not already contain '__crucible_ctor'.");
    }

    return {
        ...props,
        __crucible_ctor: type,
    };
}

/**
 * Ejects Crucible’s internal constructor reference from a props object.
 * 
 * This function removes the `__crucible_ctor` field from a props object,
 * returning the original constructor along with a clean props object.
 * 
 * @typeParam IntentPropsT - The type of props.
 * @typeParam IntentStateT - The type of state.
 * @typeParam IntentTypeT - The constructor type of the intent.
 * 
 * @param props - The props object containing `__crucible_ctor`.
 * 
 * @returns A tuple with the component constructor and cleaned props.
 */
export function ejectCrucibleCtor<
    IntentPropsT extends IntentProps,
    IntentStateT extends IntentState,
    IntentTypeT extends ConcreteIntentType<IntentPropsT, IntentStateT>
>(
    props: IntentPropsT & Ctor<IntentTypeT>
): [IntentTypeT, IntentPropsT] {

    // Eject __crucible_ctor
    const { __crucible_ctor, ...rest } = props;

    // Validate
    if (typeof __crucible_ctor !== "function" || !(__crucible_ctor.prototype instanceof Intent)) {
        throw new TypeError("Missing or invalid Component constructor during instantiation.");
    }

    return [__crucible_ctor, rest as unknown as IntentPropsT];
}

/**
 * Creates a Crucible element representing a layout intent.
 *
 * Layout intents can hold child elements, so this overload includes a variadic
 * `children` parameter. The resulting element conforms to React’s element shape
 * while embedding Crucible-specific metadata (`__crucible_ctor`) used by the
 * custom reconciler.
 *
 * @typeParam LayoutPropsT - The type of the props accepted by the layout.
 * @typeParam LayoutStateT - The type of the state maintained by the layout.
 * @typeParam LayoutTypeT - The layout component type.
 * 
 * @param type - The class constructor for the layout component.
 * @param props - The props object defining the layout’s configuration.
 * @param children - The child elements contained within this layout.
 * 
 * @returns A Crucible layout element.
 */
export function createElement<
    LayoutPropsT extends LayoutProps,
    LayoutStateT extends LayoutState,
    LayoutTypeT extends LayoutType<LayoutPropsT, LayoutStateT>
>(
    type: LayoutTypeT,
    props: InstanceType<LayoutTypeT>["props"],
    ...children: Element<typeof Intent>[]
): LayoutElement<LayoutPropsT, LayoutStateT, LayoutTypeT>;

/**
 * Creates a Crucible element representing an intent.
 *
 * Non-layout intents cannot have children. The resulting element conforms to
 * React’s element structure, making it recognizable by React’s fiber system
 * while maintaining Crucible-specific metadata for the Crucible reconciler.
 *
 * @typeParam IntentTypeT - The non-container intent type.
 * @typeParam IntentPropsT - The type of the props.
 * @typeParam IntentStateT - The type of the state.
 * 
 * @param type - The class constructor for the intent.
 * @param props - The props object defining the intent’s configuration.
 * 
 * @returns A Crucible element describing the intent instance.
 */
export function createElement<
    IntentPropsT extends IntentProps,
    IntentStateT extends IntentState,
    IntentTypeT extends IntentType<IntentPropsT, IntentStateT>
>(
    type: IntentTypeT,
    props: InstanceType<IntentTypeT>["props"]
): Element<IntentPropsT, IntentStateT, IntentTypeT>;

/**
 * Overload for composites.
 *
 * Composites are function-based intents. They are rendered immediately,
 * returning their internal Crucible element subtree.
 *
 * @param type - The composite callback function.
 * @param props - The props for the composite.
 * 
 * @returns The rendered Crucible element.
 */
export function createElement(
    type: Composite,
    props: CompositeProps,
    ...children: unknown[]
): Element<
    IntentProps,
    IntentState,
    IntentType<
        IntentProps,
        IntentState
    >
>;

/**
 * Core implementation for Crucible’s `createElement` factory.
 *
 * This function is called by both JSX and internal code to create element
 * objects compatible with React’s element shape while preserving Crucible’s
 * metadata. Crucible uses this factory to intercept JSX element creation and
 * map Crucible intent classes into React-compatible element objects.
 *
 * The reconciler later interprets the resulting element’s metadata to create
 * live intent instances.
 *
 * @param type - The class constructor for the intent.
 * @param props - The props object defining the intent’s configuration.
 * @param children - Optional child elements (for container intents).
 * 
 * @returns A Crucible element representing the intent instance.
 */
export function createElement(
    type: ConcreteIntentType | Composite,
    props: IntentProps | CompositeProps,
    ...rest: unknown[]
): Element<
    IntentProps,
    IntentState,
    IntentType<
        IntentProps,
        IntentState
    >
> {

    // Composites are called immediately to produce their element subtree.
    if (isComposite(type)) {
        return type(props as CompositeProps);
    }

    // Ensure the Crucible constructor reference is embedded in props.
    props = injectCrucibleCtor(type, props);

    // Layouts accept children
    if (type.prototype instanceof Layout) {
        props = {
            ...props,
            children: ([] as Element<typeof Intent>[]).concat(
                ...rest as Element<typeof Intent>[]
            ),
        } as unknown as LayoutProps;
    }

    // Return a React-compatible element object with Crucible metadata.
    return {
        $$typeof: Symbol.for("react.element"),
        type: type.name,
        ref: null,
        props,
    } as Element<
        IntentProps, IntentState, IntentType<
            IntentProps,
            IntentState
        >
    >;
}

/**
 * Exported under a mangled name for automatic injection by the JSX runtime.
 *
 * The build system rewrites JSX calls to use `__Crucible_createElement`
 * instead of the standard `React.createElement`. This allows Crucible to
 * control how JSX is translated into element objects without requiring
 * explicit imports in user code.
 *
 * This alias should not be used directly.
 */
export { createElement as __Crucible_createElement };

/**
 * Base interface for intent props.
 *
 * All Crucible UI intent props must extend this interface to define their own.
 * It intentionally contains no required properties, ensuring intents remain
 * instantiable without props.
 */
export interface IntentProps { }

/**
 * Base interface for intent state.
 *
 * All Crucible UI intents must extend this interface to define their own
 * internal state structure.
 */
export interface IntentState { }

/**
 * Abstract base class for all Crucible UI intents.
 *
 * This class defines the foundation of Crucible's intent model. Each subclass
 * must define specific props and state types extending from {@link IntentProps}
 * and {@link IntentState}. Intents can use `props` for configuration and `state`
 * for internal data tracking.
 *
 * @typeParam PropsT - The property type accepted by the intent.
 * @typeParam StateT - The state type maintained internally by the intent.
 */
export abstract class Intent<
    PropsT extends IntentProps = IntentProps,
    StateT extends IntentState = IntentState
> {

    /**
     * The immutable configuration object provided when the intent is
     * instantiated. It contains all user-specified properties for this
     * intent instance, as defined by the subclass’s props interface.
     */
    readonly props: PropsT;

    /**
     * The mutable internal state of the intent. Used to track transient
     * data or UI conditions during the intent’s lifecycle.
     */
    readonly state: StateT;

    /**
     * Constructs a new {@link Intent} instance.
     *
     * @param props - The immutable props object that defines this intent’s
     *                configuration. Passed automatically during instantiation.
     */
    constructor(props: PropsT) {
        this.props = props;
        this.state = {} as StateT;
    }
}

/**
 * Defines the constructor signature for an abstract Crucible UI intent type.
 *
 * Represents a class that extends {@link Intent}, parameterized by its props
 * and state types. It is abstract and not directly instantiable, and is used in
 * contexts where an intent type (not an instance) is required, such as JSX
 * element creation or intent registration.
 *
 * @typeParam IntentPropsT - The type of the props accepted by the intent.
 * @typeParam IntentStateT - The type of the state maintained by the intent.
 *
 * @param props - The props used to initialize the intent instance.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type IntentType<
    IntentPropsT extends IntentProps = IntentProps,
    IntentStateT extends IntentState = IntentState
> = abstract new (
    props: IntentPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Intent<IntentPropsT, IntentStateT>;

/**
 * Defines the constructor signature for a concrete Crucible UI intent type.
 *
 * Represents a non-abstract subclass of {@link Intent} that can be directly
 * instantiated. It is used in contexts where real intent instances are
 * created, such as in the reconciler or during runtime composition.
 *
 * @typeParam IntentPropsT - The type of the props accepted by the intent.
 * @typeParam IntentStateT - The type of the state maintained by the intent.
 *
 * @param props - The props used to initialize the intent instance.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type ConcreteIntentType<
    IntentPropsT extends IntentProps = IntentProps,
    IntentStateT extends IntentState = IntentState
> = new (
    props: IntentPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Intent<IntentPropsT, IntentStateT>;

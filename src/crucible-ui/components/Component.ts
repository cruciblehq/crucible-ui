/**
 * Base interface for component props.
 *
 * All Crucible UI component props must extend this interface to define their
 * own. It intentionally contains no required properties, ensuring components
 * remain instantiable without props.
 */
export interface ComponentProps { }

/**
 * Base interface for component state.
 *
 * All Crucible UI components must extend this interface to define their own
 * internal state structure.
 */
export interface ComponentState { }

/**
 * Abstract base class for all Crucible UI components.
 *
 * This class defines the foundation of Crucible's component model. Each
 * subclass must define specific props and state types extending from {@link
 * ComponentProps} and {@link ComponentState}. Components can use `props` for
 * configuration and `state` for internal data tracking.
 *
 * @typeParam PropsT - The property type accepted by the component.
 * @typeParam StateT - The state type maintained internally by the component.
 */
export abstract class Component<
    PropsT extends ComponentProps = ComponentProps,
    StateT extends ComponentState = ComponentState
> {

    /**
     * The immutable configuration object provided when the component is
     * instantiated. It contains all user-specified properties for this
     * component instance, as defined by the subclass’s props interface.
     */
    readonly props: PropsT;

    /**
     * The mutable internal state of the component. Used to track transient
     * data or UI conditions during the component’s lifecycle. Initialized
     * as an empty object by default and should be replaced or updated by
     * subclasses as needed.
     */
    readonly state: StateT;

    /**
     * Constructs a new {@link Component} instance.
     *
     * @param props - The immutable props object that defines this component’s
     *                configuration. Passed automatically during instantiation.
     */
    constructor(props: PropsT) {
        this.props = props;
        this.state = {} as StateT;
    }
}

/**
 * Defines the constructor signature for an abstract Crucible UI component type.
 *
 * Represents a class that extends {@link Component}, parameterized by its props
 * and state types. It is abstract and not directly instantiable, and is used in
 * contexts where a component type (not an instance) is required, such as JSX
 * element creation or component registration.
 *
 * @typeParam ComponentPropsT - The type of the props accepted by the component.
 * @typeParam ComponentStateT - The type of the state maintained by the component.
 *
 * @param props - The props used to initialize the component instance.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type ComponentType<
    ComponentPropsT extends ComponentProps = ComponentProps,
    ComponentStateT extends ComponentState = ComponentState
> = abstract new (
    props: ComponentPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Component<ComponentPropsT, ComponentStateT>;

/**
 * Defines the constructor signature for a concrete Crucible UI component type.
 *
 * Represents a non-abstract subclass of {@link Component} that can be directly
 * instantiated. It is used in contexts where real component instances are
 * created, such as in the reconciler or during runtime composition.
 *
 * @typeParam ComponentPropsT - The type of the props accepted by the component.
 * @typeParam ComponentStateT - The type of the state maintained by the component.
 *
 * @param props - The props used to initialize the component instance.
 * @param args - Additional arguments that may be passed to the constructor.
 */
export type ConcreteComponentType<
    ComponentPropsT extends ComponentProps = ComponentProps,
    ComponentStateT extends ComponentState = ComponentState
> = new (
    props: ComponentPropsT,
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => Component<ComponentPropsT, ComponentStateT>;

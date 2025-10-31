import * as React from "react";

/**
 * Base interface for all Crucible UI component properties. All Crucible
 * components must define their own props interfaces extending this one. It
 * defines the minimal structure required for compatibility with React’s
 * element model while allowing components to introduce additional properties
 * specific to their behavior or rendering. This interface intentionally has
 * no required properties so that components can be instantiated with an empty
 * props object. It provides only the universal keys React expects to appear
 * on any component: `key` and `ref`.
 */
export interface ComponentProps {

  /**
   * A unique identifier used by React to differentiate this component from
   * its siblings within the same parent. React uses this key to optimize
   * reconciliation when rendering lists of components. This property is not
   * accessed by Crucible directly, but it must exist for React compatibility.
   * When not provided, React treats the component as unkeyed.
   */
  key?: string | null;

  /**
   * A reference handle used by React to expose the component instance to
   * external code. It enables users to obtain a reference to the rendered
   * component through the `ref` attribute in JSX. Crucible itself does not
   * interpret this property but must declare it for compatibility with React.
   */
  ref?: unknown;
}

/**
 * State shared by all Crucible UI components. State stores internal, mutable
 * data that affects rendering. It changes over time through this.setState
 * and triggers re-renders. Other components must define their own state
 * interfaces that extend this one.
 */
export interface ComponentState {
}

/**
 * Abstract base class for all Crucible UI components. All components must
 * extend this class, defining their own props interfaces that extend
 * ComponentProps. Components manage their own state and lifecycle through
 * React.Component. PropsT and StateT are generic type parameters representing
 * the component's props and state types and must extend ComponentProps and
 * ComponentState respectively. SnapshotT is an optional type parameter
 * representing the type of the snapshot value returned by getSnapshotBeforeUpdate.
 * SnapshotT should be defined by the renderer, since it is used to preserve
 * native host information across DOM updates.
 */
export abstract class Component<
  PropsT extends ComponentProps = ComponentProps,
  StateT extends ComponentState = ComponentState,
  SnapshotT = unknown
> extends React.Component<PropsT, StateT, SnapshotT> {

  /**
   * Crucible UI does not allow direct updates to component props after
   * instantiation. This override of React.Component's componentDidUpdate
   * lifecycle method prevents prop updates by doing nothing when props change.
   * Any attempt to change props after creation will have no effect.
   * 
   * @param prevProps The previous props before the update (ignored).
   * @param prevState The previous state before the update (ignored).
   * @param snapshot The snapshot before the update (ignored).
   */
  override componentDidUpdate(
    _prevProps: Readonly<PropsT>,
    _prevState: Readonly<StateT>,
    _snapshot?: SnapshotT | undefined): void {
    return
  }
}

/**
 * Type representing a Crucible UI component class constructor. This type is
 * used when creating components dynamically. The constructor takes a props
 * object and returns an instance of the Component class. Additionally, the
 * type includes optional static properties that provide metadata about the
 * component class.
 */
export type ComponentType<
  PropsT extends ComponentProps = ComponentProps,
  StateT extends ComponentState = ComponentState,
  SnapshotT = unknown
> = (new (props: PropsT) => Component<PropsT, StateT, SnapshotT>) & {

  /**
   * Indicates whether this component can contain child components.
   * Container components (like View) should set this to true.
   *
   * @returns True if the component is a container; otherwise, false.
   */
  readonly isContainer?: boolean;

  /**
   * Indicates whether this component represents structured content, allowing
   * rich markup text. This static property is used for type checking and
   * identification of Content components.
   *
   * @return True if the component is a Content component; otherwise, false.
   */
  readonly isContent?: boolean;
};

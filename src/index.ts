/**
 * @packageDocumentation
 * @module crucible-ui
 *
 * Crucible UI Core Module. This module exports the main Crucible UI API,
 * including component types, props, and the createElement function used
 * to construct Crucible elements from JSX. It serves as the entry point
 * for using Crucible UI in applications.
 */
import type { ComponentType, ComponentProps } from "./core";
import type { ReactElement } from "react";

export * from "./core";

/**
 * Crucible UI version of React.createElement.
 * 
 * This function is automatically called when JSX is used. It constructs a
 * Crucible component description (a React element) that the reconciler will
 * later instantiate and render via the Crucible host configuration.
 *
 * @param type The Crucible component class (e.g. View, Content).
 * @param props The component props object.
 * @param children Any child elements or text.
 * @returns A Crucible element compatible with React Reconciler.
 */
function createElement(
  type: ComponentType,
  props: ComponentProps,
  ...children: unknown[]
): ReactElement<ComponentProps, ComponentType> {

  // Merge children into props like React does
  const normalizedProps: ComponentProps = {
    ...props,
    ...(children.length > 0
      ? {
        children: children.length === 1
          ? children[0]
          : children
      }
      : {})
  };

  // Return the standard React element shape
  return {
    $$typeof: Symbol.for('react.element'),
    type,
    key: normalizedProps.key ?? null,
    ref: normalizedProps.ref ?? null,
    props: normalizedProps,
    _owner: null
  } as ReactElement<ComponentProps, ComponentType>;
}

/**
 * Creates a React fragment element for Crucible UI. A fragment groups
 * multiple children without introducing an extra wrapping component. It
 * behaves identically to React.Fragment in JSX.
 *
 * @param children The child elements or nodes to include in the fragment.
 * @param key Optional key used to uniquely identify the fragment.
 * @returns A React fragment element object.
 */
function Fragment(
  children: unknown[],
  key: string | null = null
): ReactElement {
  return {
    $$typeof: Symbol.for('react.element'),
    type: Symbol.for('react.fragment'),
    key,
    ref: null,
    props: { children },
    _owner: null,
  } as unknown as ReactElement;
}

export const Crucible = {
  createElement,
  Fragment,
};

export namespace Crucible {
  export interface API {
    log(message: string): void;
  }
}

export default Crucible;

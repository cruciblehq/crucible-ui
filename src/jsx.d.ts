import type { ComponentType, ComponentProps } from "./core";
import type { ReactElement } from "react";
import { Crucible } from ".";

declare global {
  namespace JSX {

    // The type of a JSX element created in Crucible UI
    type Element = ReactElement<ComponentProps, ComponentType>;
    type Fragment = typeof Crucible.Fragment;

    // What can appear in the tag position
    type ElementType =
      | ComponentType                    // Crucible component classes
      | typeof Crucible.Fragment;        // the Fragment token


    // No built-in intrinsic elements
    interface IntrinsicElements {
    }

    // The type of `props` in class components
    interface ElementAttributesProperty {
      props: {};
    }

    // The type of the `children` property
    interface ElementChildrenAttribute {
      children: unknown;
    }
  }
}

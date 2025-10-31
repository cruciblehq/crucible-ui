import type React from "react";
import type { Component } from "../components";

/**
 * Type alias for a reference to a Crucible UI component instance.
 * 
 * Crucible UI simply reuses React's {@link Ref} type here since Crucible UI
 * components are compatible with React refs. This enables both callback refs
 * and ref objects.
 */
export type Ref = React.Ref<Component>;

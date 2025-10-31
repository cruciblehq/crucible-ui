import {
    Container,
    type ContainerProps,
    type ContainerState
} from "./Container";

/**
 * Props for the {@link Fragment} component.
 *
 * Fragments act as structural groupings without introducing new visual or
 * logical boundaries. They inherit all container props but do not impose
 * layout or style semantics (unlike {@link View}).
 */
export interface FragmentProps extends ContainerProps { }

/**
 * State for the {@link Fragment} component.
 *
 * Fragments do not maintain internal state but extend {@link ContainerState}.
 */
export interface FragmentState extends ContainerState { }

/**
 * Represents a logical grouping of child components.
 *
 * Unlike other containers, {@link Fragment} does not map to any renderable
 * element in the host environment. It exists purely as a structural construct,
 * grouping children without producing its own primitive.
 */
export class Fragment extends Container<FragmentProps, FragmentState> { }

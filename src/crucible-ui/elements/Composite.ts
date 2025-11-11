import type { Element } from './Element';
import {
    Intent,
    type IntentState,
    type IntentProps,
    type IntentType,
} from '../intents';

/**
 * Properties accepted by a {@link Composite} component.
 * 
 * Composite props shouldn't really extends {@link IntentProps}, since they live
 * in different layers. However, composites do accept the same same props as
 * intents (plus any arbitrary ones), so this is a practical compromise.
 * Additionally, this allows composites to be used in places where intents
 * are expected.
 */
export interface CompositeProps extends IntentProps {

    /**
     * The child elements contained within the composite.
     * 
     * Composites may optionally accept children, which can be a single
     * element or an array of elements.
     * 
     * @remarks Accepting a single child or an array is an unfortunate
     * inheritance from JSX's model.
     */
    readonly children?: Element | Element[];

    /**
     * Additional arbitrary properties.
     * 
     * Composites may accept any number of additional properties beyond those
     * explicitly defined here.
     */
    readonly [key: string]: unknown;
}

/**
 * Function signature for a {@link Composite} component.
 * 
 * Composites encapsulate reusable UI patterns or behaviors by composing
 * lower-level components. A {@link Composite} is a function that defines
 * a composite by returning an element tree built from other components.
 * 
 * @param props - The properties defining the composite's configuration.
 * 
 * @returns An element tree representing the composite's UI structure.
 */
export type Composite = (props: CompositeProps)
    => Element<
        IntentProps,
        IntentState,
        IntentType<
            IntentProps,
            IntentState
        >
    >

/**
 * Type guard to determine if a type is a {@link Composite}.
 *
 * @param type - The type to check.
 * 
 * @returns `true` if the type is a {@link Composite}; `false` otherwise.
 */
export function isComposite(type: IntentType | Composite): type is Composite {
    return !type.prototype || !(type.prototype instanceof Intent);
}

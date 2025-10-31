import type { Element } from '../elements';
import type { API } from '../interface';
import {
    type ComponentProps,
    type ConcreteComponentType,
} from './Component';

/**
 * Defines the properties accepted by a {@link Composite} component.
 * 
 * Composites encapsulate reusable UI patterns or behaviors by composing
 * lower-level components. The {@link CompositeProps} interface extends
 * {@link ComponentProps} to inherit common component properties.
 */
export interface CompositeProps extends ComponentProps {
}

/**
 * Defines the function signature for a {@link Composite} component.
 * 
 * Composites encapsulate reusable UI patterns or behaviors by composing
 * lower-level components. A {@link Composite} is a function that defines
 * a composite by returning an element tree built from other components.
 * 
 * @param props - The properties defining the composite's configuration.
 * @returns An element tree representing the composite's UI structure.
 */
export type Composite = (props: CompositeProps)
    => Element<ConcreteComponentType>;

/**
 * Defines the function signature for a {@link Composite} component
 * that receives an {@link API} instance as its first argument.
 * 
 * {@link API} enables the composite to interact with the host environment,
 * bypassing the SES sandbox restrictions only for authorized actions. Only
 * the main widget entry point should use this signature to gain access to
 * the API. Nested composites should use the standard {@link Composite}
 * signature.
 * 
 * @remarks Future revisions may use this signature for all composites,
 *          although no safe way currently exists to inject the API into
 *          nested composites.
 * 
 * @param api - The API instance provided to the composite for interacting
 *              with the host environment.
 * @param props - The properties defining the composite's configuration.
 * @returns An element tree representing the composite's UI structure.
 */
export type CompositeWithAPI = (api: API, props: CompositeProps)
    => Element<ConcreteComponentType>;

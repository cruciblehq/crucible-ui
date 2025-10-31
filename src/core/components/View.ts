import type { Container } from "./Container";
import {
    Component,
    type ComponentProps,
    type ComponentState
} from "./Component";

/**
 * Properties for the View component, which serves as a container
 * for other components.
 */
export interface ViewProps extends ComponentProps {

    /**
     * The child components to be contained within this view. These
     * components will be rendered inside the view in the order they
     * are provided.
     */
    children?: Component<ComponentProps, ComponentState>[];
}

/**
 * View component that can contain and manage child components. It extends
 * the base Component class and implements the Container interface,
 * allowing it to hold other components. Views are used to structure the UI
 * and group related components together, providing a hierarchical layout.
 * They accept any type of Component as children.
 */
export class View extends Component<ComponentProps, ComponentState> implements Container<Component<ComponentProps, ComponentState>> {

    /**
     * Indicates that this component is a container and can hold child
     * components. This static property is used by the isContainer type guard
     * function to determine if a component can contain children.
     */
    static readonly isContainer = true;

    /**
     * The child components contained within this view component. Any
     * component can be added as a child, and they will be rendered in
     * the order they were added.
     */
    private readonly _children: Component<ComponentProps, ComponentState>[];

    /**
     * Construct a new View component with the provided properties and
     * child components.
     * 
     * @param props Properties for the View component.
     */
    constructor(props: ViewProps) {
        super(props);

        // Shallow copy to prevent external mutation
        this._children = [...(props.children || [])];
    }

    /**
     * Get the child components contained within this view. These are the
     * components that will be rendered inside this view.
     * 
     * @returns An array of child components.
     */
    get children(): Component<ComponentProps, ComponentState>[] {
        return this._children;
    }

    /**
     * Append a child component to this view. The child will be added to the
     * end of the current list of children.
     * 
     * @param child The child component to append.
     */
    appendChild(child: Component<ComponentProps, ComponentState>): void {
        this._children.push(child);
    }

    /**
     * Insert a child component before another child in this view. The new
     * child will be placed immediately before the specified existing child.
     * 
     * @param child The child component to insert.
     * @param beforeChild The existing child component to insert before.
     */
    insertChildBefore(child: Component<ComponentProps, ComponentState>, beforeChild: Component<ComponentProps, ComponentState>): void {
        const index = this._children.indexOf(beforeChild);

        if (index === -1) {
            throw new Error("The specified beforeChild is not a child of this View.");
        }

        this._children.splice(index, 0, child);
    }

    /**
     * Remove a child component from this view. The specified child will be
     * removed from the list of children.
     * 
     * @param child The child component to remove.
     */
    removeChild(child: Component<ComponentProps, ComponentState>): void {
        const index = this._children.indexOf(child);

        if (index === -1) {
            throw new Error("The specified child is not a child of this View.");
        }

        this._children.splice(index, 1);
    }
}

/**
 * Intrinsic props that can be applied to any Crucible UI element.
 * 
 * This interface mimics React's intrinsic attributes to ensure compatibility
 * with the JSX runtime. `React.JSX.IntrinsicAttributes` introduces `key`,
 * defined as an optional property used by React for element reconciliation.
 * 
 * @Note The JSX runtime calls these "attributes", but they are essentially
 *       props that can be passed to any element. We keep the naming consistent
 *       with JSX's terminology here and with React's everywhere else.
 */
export interface IntrinsicAttributes {
    key?: string | number | bigint | null | undefined;
}

/**
 * Crucible UI does not define any built-in intrinsic elements. All UI elements
 * are created using components. This interface is provided to satisfy the JSX
 * runtime requirements.
 */
export interface IntrinsicElements { }

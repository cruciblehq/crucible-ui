/**
 * Manifest type definition.
 * 
 * Manifests define the structure of the configuration file that specify the
 * widgets to be loaded by the Crucible UI host. Each widget is defined by its
 * name and the path to its module.
 * 
 * Manifests should be fetched from a server or external source. Since that's
 * not yet implemented, we define a placeholder type here for development. This
 * type will change.
 */
export type Manifest = {
    widgets: Array<{
        name: string;
        path: string;
    }>;
}

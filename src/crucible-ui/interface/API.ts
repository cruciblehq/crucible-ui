/**
 * Defines the API provided to Crucible UI components to access native
 * functionality outside the SES sandbox.
 * 
 * These are the only interaction points between Crucible UI components and the
 * global host environment. Anything else should be prohibited by the SES
 * confinement, ensuring components cannot perform unauthorized actions.
 */
export interface API {

    /**
     * Logs general messages to the host environment's logging system.
     * 
     * Logs are disabled during production builds.
     * 
     * @param data - The data to log. This can be of any type.
     */
    log(...data: any[]): void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

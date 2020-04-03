/**
 * Basic log manager
 */

export class LogManager {
    protected isLoggingEnabled = true;
    private readonly logDomain: string;
    private readonly deviceId: string = '';

    constructor(logDomain: string) {
        this.logDomain = logDomain;
    }

    /**
     * Wrap log string in color
     */
    private wrapInColor(color: string, str: string): string[] {
        if (!str) {
            str = '-';
        }
        const prefix = '%c';
        const suffix = 'color:' + color + ';font-weight:bold;';
        return [prefix + str, suffix];
    }

    private prepFnName(functionName: string): string {
        return '- ' + functionName + '():';
    }

    /**
     * Submit to console log
     */
    public log(functionName: string, ...args: any[]): void {
        if (this.isLoggingEnabled) {
            const color = 'blue';
            console.log('[CORONA]', ...this.wrapInColor(color, this.logDomain), this.prepFnName(functionName), ...args);
        }
    }

    /**
     * Submit to console warn
     */
    public warn(functionName: string, ...args: any[]): void {
        if (this.isLoggingEnabled) {
            const color = 'corn';
            console.warn('[CORONA]', ...this.wrapInColor(color, this.logDomain), this.prepFnName(functionName), ...args);
        }
    }

    /**
     * Submit to console error
     */
    public error(functionName: string, ...args: any[]): void {
        if (this.isLoggingEnabled) {
            const color = 'firebrick';
            console.error('[CORONA]', ...this.wrapInColor(color, this.logDomain), this.prepFnName(functionName), ...args);
        }
    }

    /**
     * Concat args to string
     */
    private argsToMessageStr(...args: any[]): string {
        return []
            .concat(...args)
            .filter(a => a)
            .map(a => (typeof a === 'string' || typeof a === 'number' ? a : JSON.stringify(a)))
            .join(', ');
    }
}

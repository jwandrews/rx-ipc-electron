import { Observable } from 'rxjs';
import { ObservableFactoryFunction, Receiver } from './index';
export declare class RxIpc {
    private ipc;
    static listenerCount: number;
    listeners: {
        [id: string]: boolean;
    };
    constructor(ipc: any);
    checkRemoteListener(channel: string, receiver: Receiver): Promise<unknown>;
    cleanUp(): void;
    registerListener(channel: string, observableFactory: ObservableFactoryFunction): void;
    removeListeners(channel: string): void;
    runCommand(channel: string, receiver?: Receiver, ...args: any[]): Observable<any>;
    _getListenerCount(channel: string): any;
}

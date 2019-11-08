import { Observable } from 'rxjs';
export declare type IpcListener = (event: any, ...args: any[]) => void;
export declare type ObservableFactoryFunction<T extends any = any> = (...args: any[]) => Observable<T>;
export interface Receiver {
    send(channel: string, ...args: any[]): void;
}

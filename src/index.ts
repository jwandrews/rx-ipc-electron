import { Observable } from 'rxjs';

export type IpcListener = (event, ...args) => void;

export type ObservableFactoryFunction<T extends any = any> = (...args: any[]) => Observable<T>;

export interface Receiver {
  send(channel: string, ...args: any[]): void;
}

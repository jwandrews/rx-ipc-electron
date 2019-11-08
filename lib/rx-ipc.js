"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class RxIpc {
    constructor(ipc) {
        this.ipc = ipc;
        this.listeners = {};
        // Respond to checks if a listener is registered
        this.ipc.on('rx-ipc-check-listener', (event, channel) => {
            const replyChannel = 'rx-ipc-check-reply:' + channel;
            if (this.listeners[channel]) {
                event.sender.send(replyChannel, true);
            }
            else {
                event.sender.send(replyChannel, false);
            }
        });
    }
    checkRemoteListener(channel, receiver) {
        const target = receiver == null ? this.ipc : receiver;
        return new Promise((resolve, reject) => {
            this.ipc.once('rx-ipc-check-reply:' + channel, (_, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(false);
                }
            });
            target.send('rx-ipc-check-listener', channel);
        });
    }
    cleanUp() {
        this.ipc.removeAllListeners('rx-ipc-check-listener');
        Object.keys(this.listeners).forEach((channel) => {
            this.removeListeners(channel);
        });
    }
    registerListener(channel, observableFactory) {
        this.listeners[channel] = true;
        this.ipc.on(channel, function openChannel(event, subChannel, ...args) {
            // Save the listener function so it can be removed
            const replyTo = event.sender;
            const observable = observableFactory(...args);
            observable.subscribe((data) => {
                replyTo.send(subChannel, 'n', data);
            }, (err) => {
                replyTo.send(subChannel, 'e', err);
            }, () => {
                replyTo.send(subChannel, 'c');
            });
        });
    }
    removeListeners(channel) {
        this.ipc.removeAllListeners(channel);
        delete this.listeners[channel];
    }
    runCommand(channel, receiver = null, ...args) {
        const self = this;
        const subChannel = channel + ':' + RxIpc.listenerCount;
        RxIpc.listenerCount++;
        const target = receiver == null ? this.ipc : receiver;
        target.send(channel, subChannel, ...args);
        return new rxjs_1.Observable((observer) => {
            this.checkRemoteListener(channel, receiver).catch(() => {
                observer.error('Invalid channel: ' + channel);
            });
            this.ipc.on(subChannel, function listener(event, type, data) {
                switch (type) {
                    case 'n':
                        observer.next(data);
                        break;
                    case 'e':
                        observer.error(data);
                        break;
                    case 'c':
                        observer.complete();
                }
                // Cleanup
                return () => {
                    self.ipc.removeListener(subChannel, listener);
                };
            });
        });
    }
    _getListenerCount(channel) {
        return this.ipc.listenerCount(channel);
    }
}
exports.RxIpc = RxIpc;
RxIpc.listenerCount = 0;
//# sourceMappingURL=rx-ipc.js.map
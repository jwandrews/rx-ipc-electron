import { ipcMain, webContents } from 'electron';
import { from, Observable, Subscriber } from 'rxjs';
import rxIpc from '../../src/main';

function testMain(...args: number[]) {
  return from(args);
}

function testError() {
  return new Observable((observer: Subscriber<number>) => {
    observer.next(1);
    observer.next(2);
    observer.error('Test Error');
  });
}

ipcMain.on('main-run-command', (event: Electron.IpcMainEvent) => {
  const results = [];
  rxIpc.runCommand('command-from-main', event.sender, 3, 2, 1).subscribe(
    (data: number) => {
      results.push(data);
    },
    (err: Error) => {
      throw err;
    },
    () => {
      event.sender.send('results-from-main', results);
    }
  );
});

rxIpc.registerListener('test-main', testMain);
rxIpc.registerListener('test-error', testError);

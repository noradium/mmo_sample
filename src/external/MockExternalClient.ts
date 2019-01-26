import {ExternalClient} from './ExternalClient';
import {ChatSignal, JoinSignal, MoveSignal, Signal, SignalData, SignalType} from './Signal';

class PromiseMock<T> implements Promise<T> {
  constructor(private result?: T) {
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
    onfulfilled(this.result);
    return new PromiseMock();
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
    onrejected('reject');
    return new PromiseMock();
  }
}

export class MockExternalClient extends ExternalClient {
  getSelfInformation() {
    return new PromiseMock({
      id: null,
      name: 'NoName'
    });
  }

  onSignalReceived(callback: (signal: Signal) => any) {
    this.scene.setTimeout(() => {
      const signal: JoinSignal = {
        senderId: 1,
        senderName: 'hogehoge',
        data: {
          type: SignalType.Join,
          senderX: 300,
          senderY: 200
        }
      };
      callback(signal);
    }, 4000);
    this.scene.setTimeout(() => {
      const signal: ChatSignal = {
        senderId: 1,
        senderName: 'hogehoge',
        data: {
          type: SignalType.Chat,
          text: 'こんにちは'
        }
      };
      callback(signal);
    }, 6000);
    this.scene.setTimeout(() => {
      const signal: MoveSignal = {
        senderId: 1,
        senderName: 'hogehoge',
        data: {
          type: SignalType.Move,
          senderX: 100,
          senderY: 300
        }
      };
      callback(signal);
    }, 8000);
  }

  sendGlobalSignal(signalData: SignalData) {
    return new PromiseMock(void 0);
  }

  onCommentPosted(callback: (comment: {command: string, comment: string}) => void) {
    this.scene.setTimeout(() => {
      callback({
        command: '',
        comment: '入力されたコメント'
      });
    }, 3000);
  }
}

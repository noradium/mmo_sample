import {ExternalClient} from './ExternalClient';
import {AliveSignal, ChatSignal, ChatSignalData, JoinSignal, JoinSignalData, MoveSignal, Signal, SignalData, SignalType} from './Signal';
import GlobalSignal = RPGAtsumaru.GlobalSignal;
import {Util} from '../util/Util';

export class RPGAtsumaruClient extends ExternalClient {
  private lastGlobalSignalCreatedAt: number = 0;
  private getGlobalSignalsTimer: g.TimerIdentifier = null;
  private signalReceivedCallbacks: ((signal: Signal) => any)[] = [];

  getSelfInformation() {
    return RPGAtsumaru.experimental.user.getSelfInformation()
      .then(rpgAtsumaruSelfInformation => {
        return {
          id: rpgAtsumaruSelfInformation.id,
          name: rpgAtsumaruSelfInformation.name
        };
      })
      .catch(_ => {
        return {
          id: null,
          name: 'NoName'
        };
      });
  }

  onSignalReceived(callback: (signal: Signal) => any) {
    if (this.signalReceivedCallbacks.length === 0) {
      this.registerGetGlobalSignalsTimer();
    }
    this.signalReceivedCallbacks.push(callback);
  }

  sendGlobalSignal(signalData: SignalData) {
    return RPGAtsumaru.experimental.signal.sendSignalToGlobal(this.createGlobalSignalData(signalData))
      .catch(() => {
        //
      });
  }

  onCommentPosted(callback: (comment: {command: string, comment: string}) => void) {
    RPGAtsumaru.comment.posted.subscribe(callback);
  }

  private registerGetGlobalSignalsTimer() {
    this.getGlobalSignalsTimer = this.scene.setInterval(() => {
      RPGAtsumaru.experimental.signal.getGlobalSignals()
        .then(globalSignals => {
          if (!globalSignals) {
            return;
          }
          // 一番最初は最新の createdAt で初期化だけして終わり
          if (this.lastGlobalSignalCreatedAt === 0) {
            globalSignals.forEach(globalSignal => {
              if (this.lastGlobalSignalCreatedAt < globalSignal.createdAt) {
                this.lastGlobalSignalCreatedAt = globalSignal.createdAt;
              }
            });
            return;
          }
          globalSignals
            .filter(globalSignal => globalSignal.createdAt > this.lastGlobalSignalCreatedAt)
            .forEach(globalSignal => {
              if (this.lastGlobalSignalCreatedAt < globalSignal.createdAt) {
                this.lastGlobalSignalCreatedAt = globalSignal.createdAt;
              }
              this.signalReceivedCallbacks.forEach(callback => {
                callback(this.createSignal(globalSignal));
              });
            });
        })
        .catch(() => {
          //
        });
    }, 5000);
  }

  private createSignal(globalSignal: GlobalSignal) {
    const data = Util.queryParse(globalSignal.data);
    switch (data.type) {
      case SignalType.Join:
        return { // JoinSignal
          senderId: globalSignal.senderId,
          senderName: globalSignal.senderName,
          data: {
            type: SignalType.Join,
            senderX: parseInt(data.senderX, 10),
            senderY: parseInt(data.senderY, 10)
          }
        } as JoinSignal;
      case SignalType.Chat:
        return { // ChatSignal
          senderId: globalSignal.senderId,
          senderName: globalSignal.senderName,
          data: {
            type: SignalType.Chat,
            text: data.text
          }
        } as ChatSignal;
      case SignalType.Alive:
        return { // AliveSignal
          senderId: globalSignal.senderId,
          senderName: globalSignal.senderName,
          data: {
            type: SignalType.Alive,
            senderX: parseInt(data.senderX, 10),
            senderY: parseInt(data.senderY, 10)
          }
        } as AliveSignal;
      case SignalType.Move:
        return { // MoveSignal
          senderId: globalSignal.senderId,
          senderName: globalSignal.senderName,
          data: {
            type: SignalType.Move,
            senderX: parseInt(data.senderX, 10),
            senderY: parseInt(data.senderY, 10)
          }
        } as MoveSignal;
    }
    return null;
  }

  private createGlobalSignalData(signalData: SignalData): string {
    switch (signalData.type) {
      case SignalType.Join:
        return Util.queryStringify({
          type: SignalType.Join,
          senderX: signalData.senderX,
          senderY: signalData.senderY
        });
      case SignalType.Chat:
        return Util.queryStringify({
          type: SignalType.Chat,
          text: signalData.text
        });
      case SignalType.Alive:
        return Util.queryStringify({
          type: SignalType.Alive,
          senderX: signalData.senderX,
          senderY: signalData.senderY
        });
      case SignalType.Move:
        return Util.queryStringify({
          type: SignalType.Move,
          senderX: signalData.senderX,
          senderY: signalData.senderY
        });
    }
    return null;
  }
}

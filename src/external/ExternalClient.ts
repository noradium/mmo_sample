import {JoinSignal, Signal, SignalData, SignalType} from './Signal';

export interface SelfInformation {
  id: number | null;
  name: string;
}

export abstract class ExternalClient {
  constructor(protected scene: g.Scene) {
    //
  }
  abstract getSelfInformation(): Promise<SelfInformation>;
  abstract onSignalReceived(callback: (signal: Signal) => any): void;
  abstract sendGlobalSignal(signalData: SignalData): Promise<void>;
  abstract onCommentPosted(callback: (comment: {command: string, comment: string}) => void): void;
}

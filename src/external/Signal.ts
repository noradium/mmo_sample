export enum SignalType {
  Join = '0',
  Chat = '1',
  Alive = '2',
  Move = '3'
}

export interface JoinSignalData {
  type: SignalType.Join;
  senderX: number;
  senderY: number;
}

export interface ChatSignalData {
  type: SignalType.Chat;
  text: string;
}

export interface AliveSignalData {
  type: SignalType.Alive;
  senderX: number;
  senderY: number;
}

export interface MoveSignalData {
  type: SignalType.Move;
  senderX: number;
  senderY: number;
}

export type SignalData =
  JoinSignalData |
  ChatSignalData |
  AliveSignalData |
  MoveSignalData;

export interface Signal<Data = SignalData> {
  senderId: number;
  senderName: string;
  data: Data;
}

export type JoinSignal = Signal<JoinSignalData>;
export type ChatSignal = Signal<ChatSignalData>;
export type AliveSignal = Signal<AliveSignalData>;
export type MoveSignal = Signal<MoveSignalData>;

export function isJoinSignal(signal: Signal): signal is JoinSignal {
  return signal.data.type === SignalType.Join;
}

export function isChatSignal(signal: Signal): signal is ChatSignal {
  return signal.data.type === SignalType.Chat;
}

export function isAliveSignal(signal: Signal): signal is AliveSignal {
  return signal.data.type === SignalType.Alive;
}

export function isMoveSignal(signal: Signal): signal is MoveSignal {
  return signal.data.type === SignalType.Move;
}

declare namespace RPGAtsumaru {
  interface Scoreboards {
    setRecord(board_id: number, score: number): Promise<void>;
    display(board_id: number): Promise<void>;
  }
  interface User {
    getSelfInformation(): Promise<SelfInformation>;
  }
  interface Signal {
    getGlobalSignals(): Promise<GlobalSignal[]>;
    sendSignalToGlobal(data: string): Promise<void>;
  }
  interface CommentPosted {
    subscribe(next: (comment: {command: string, comment: string}) => void): void;
  }
  interface GlobalSignal {
    id: number;
    senderId: number;
    senderName: string;
    data: string;
    createdAt: number;
  }
  interface SelfInformation {
    id: number;
    name: string;
    isPremium: boolean;
    profile: string;
    twitterId: string;
    url: string;
  }

  export const experimental: {
    scoreboards: Scoreboards;
    user: User;
    signal: Signal;
  };
  export const comment: {
    posted: CommentPosted;
  };
}

import {ExternalClient} from '../external/ExternalClient';
import {Player} from '../object/Player';
import {ExternalClientFactory} from '../external/ExternalClientFactory';
import {Background} from '../object/Background';
import {isAliveSignal, isChatSignal, isJoinSignal, isMoveSignal, Signal, SignalType} from '../external/Signal';
import {ConsolePanel} from '../object/ConsolePanel';

export class MainScene extends g.Scene {
  private externalClient: ExternalClient;
  private players: Player[] = [];
  private myPlayer: Player;

  constructor(props: g.SceneParameterObject) {
    super(props);
    this.externalClient = ExternalClientFactory.create(this);
    this.loaded.add(() => this.onLoaded());
  }

  private onLoaded() {
    const background = new Background({
      scene: this
    });
    background.pointDown.add(event => this.onBackgroundPointDown(event));
    this.append(background);

    const consolePanel = new ConsolePanel({
      scene: this
    });
    consolePanel.onMessageButtonClick.add(event => {
      this.externalClient.sendGlobalSignal({
        type: SignalType.Chat,
        text: event.message
      });
      this.myPlayer.setChat(event.message);
    });
    this.append(consolePanel);

    this.externalClient.onSignalReceived(signal => this.onSignalReceived(signal));

    this.externalClient.onCommentPosted(comment => {
      this.externalClient.sendGlobalSignal({
        type: SignalType.Chat,
        text: comment.comment
      });
      this.myPlayer.setChat(comment.comment);
    });

    this.externalClient.getSelfInformation()
      .then(selfInformation => {
        this.myPlayer = this.appendPlayer(selfInformation.id, selfInformation.name, this.game.random.get(50, this.game.width - 128 - 50), this.game.random.get(150, this.game.height - 128 - 10));
        // 自分のジョインシグナルを全員に送る
        this.externalClient.sendGlobalSignal({
          type: SignalType.Join,
          senderX: this.myPlayer.x,
          senderY: this.myPlayer.y
        });
        // 10秒に1回全員に自分のaliveシグナルを送る
        this.setInterval(() => {
          this.externalClient.sendGlobalSignal({
            type: SignalType.Alive,
            senderX: this.myPlayer.x,
            senderY: this.myPlayer.y
          });
        }, 10000);
        // 最後のaliveシグナルから時間が経っているプレーヤを消す
        this.setInterval(() => {
          const newPlayers = this.players.map(player => {
            if (player !== this.myPlayer && this.game.age - player.getLastAliveSignalTime() > 12000 / 1000 * this.game.fps) {
              player.destroy();
              return null;
            }
            return player;
          });
          this.players = newPlayers.filter(player => player !== null);
        }, 3000);
      });
  }

  private onBackgroundPointDown(event: g.PointDownEvent) {
    if (!this.myPlayer) {
      return;
    }
    this.myPlayer.smoothlyMoveTo(event.point.x, event.point.y);
    this.externalClient.sendGlobalSignal({
      type: SignalType.Move,
      senderX: event.point.x,
      senderY: event.point.y
    });
  }

  private onSignalReceived(signal: Signal) {
    if (isJoinSignal(signal)) {
      this.appendPlayer(signal.senderId, signal.senderName, signal.data.senderX, signal.data.senderY);
    }
    if (isAliveSignal(signal)) {
      const players = this.players.filter(player => player.userId === signal.senderId);
      if (players.length === 0) {
        this.appendPlayer(signal.senderId, signal.senderName, signal.data.senderX, signal.data.senderY);
      } else {
        players[0].updateAliveSignalTime(this.game.age);
      }
    }
    if (isChatSignal(signal)) {
      this.players.forEach(player => {
        if (player.userId === signal.senderId && player !== this.myPlayer) {
          player.setChat(signal.data.text);
        }
      });
    }
    if (isMoveSignal(signal)) {
      this.players.forEach(player => {
        if (player.userId === signal.senderId && player !== this.myPlayer) {
          player.smoothlyMoveTo(signal.data.senderX, signal.data.senderY);
        }
      });
    }
  }

  private appendPlayer(userId: number, userName: string, x: number, y: number) {
    const player = new Player({
      scene: this,
      userId,
      userName,
      x,
      y
    });
    this.players.push(player);
    this.append(player);
    return player;
  }
}

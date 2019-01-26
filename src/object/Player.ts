import {Easing, Timeline, Tween} from '@akashic-extension/akashic-timeline';
import {Chat} from './Chat';

export class Player extends g.E {
  readonly userId: number;
  readonly userName: string;
  private timeline: Timeline;
  private moveToTween: Tween;
  private image: g.Sprite;
  private nameLabel: g.Label;
  private chat: Chat;
  private chatHideTimer: g.TimerIdentifier;
  private lastAliveSignalTime: number;

  constructor(params: {
    scene: g.Scene;
    userId: number;
    userName: string;
    x: number;
    y: number;
  }) {
    super({
      scene: params.scene,
      x: params.x,
      y: params.y
    });
    this.userId = params.userId;
    this.userName = params.userName;
    this.lastAliveSignalTime = params.scene.game.age;
    const asset = (() => {
      switch (params.scene.game.random.get(0, 2)) {
        case 0:
          return 'akari';
        case 1:
          return 'akane';
        case 2:
          return 'aoi';
      }
    })();
    this.image = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets[asset]
    });
    this.nameLabel = new g.Label({
      scene: params.scene,
      text: params.userName,
      font: new g.DynamicFont({
        game: params.scene.game,
        fontFamily: g.FontFamily.SansSerif,
        size: 20
      }),
      fontSize: 20
    });
    this.nameLabel.x = (this.image.width - this.nameLabel.width) / 2;
    this.append(this.image);
    this.append(this.nameLabel);
    this.width = this.image.width;
    this.height = this.image.height;
    this.modified();

    this.timeline = new Timeline(this.scene);
    this.timeline.create(this, {loop: true, modified: this.modified, destroyed: this.destroyed})
      .wait(this.scene.game.random.get(10000, 25000))
      .moveBy(0, -30, 350, Easing.easeOutQuart)
      .moveBy(0, 30, 350, Easing.easeInQuart);
  }

  setChat(text: string) {
    if (this.chatHideTimer && !this.chatHideTimer.destroyed()) {
      this.chatHideTimer.destroy();
    }
    if (this.chat && !this.chat.destroyed()) {
      this.chat.destroy();
      this.chat = null;
    }

    this.chat = new Chat({
      scene: this.scene,
      text: text
    });
    this.chat.x = (this.image.width - this.chat.width) / 2;
    this.chat.y = -this.chat.height - 5;
    this.append(this.chat);
    this.chatHideTimer = this.scene.setTimeout(() => {
      this.chat.destroy();
      this.chat = null;
    }, 3000);
  }

  updateAliveSignalTime(age: number) {
    this.lastAliveSignalTime = age;
  }

  getLastAliveSignalTime() {
    return this.lastAliveSignalTime;
  }

  smoothlyMoveTo(x: number, y: number) {
    if (this.moveToTween && !this.moveToTween.destroyed()) {
      this.timeline.remove(this.moveToTween);
      this.moveToTween = null;
    }
    const targetX = x - this.width / 2;
    const targetY = y - this.height / 2;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.moveToTween = this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
      .moveTo(targetX, targetY, distance * 6, Easing.easeOutQuad);
  }

  destroy() {
    super.destroy();
    if (this.chatHideTimer && !this.chatHideTimer.destroyed()) {
      this.chatHideTimer.destroy();
    }
  }
}

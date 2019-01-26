import {Button} from './Button';

export class ConsolePanel extends g.E {
  readonly onMessageButtonClick: g.Trigger<{
    message: string;
  }>;
  private MESSAGES = [
    'こんにちは',
    'おはよう',
    'おつ',
    'おやすみ',
    '^^',
    'きのこ',
    'たけのこ',
    'にゃーん',
    'じゃんけん',
    'グー',
    'チョキ',
    'パー',
    '(´・ω・`)',
    '(`・ω・´)',
    'すごーい'
  ];

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      local: true
    });
    this.onMessageButtonClick = new g.Trigger<{message: string}>();

    let nextX = 10;
    let nextY = 5;
    this.MESSAGES.forEach(message => {
      const button = new Button({
        scene: params.scene,
        labelText: message
      });
      button.pointDown.add(() => this.onMessageButtonClick.fire({message}));

      if (nextX + button.width > this.scene.game.width) {
        nextX = 10;
        nextY += button.height + 5;
      }
      button.x = nextX;
      button.y = nextY;
      this.append(button);
      nextX += button.width + 5;
    });
    this.height = nextY + 5;
    this.modified();
  }
}

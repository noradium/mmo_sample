export class Chat extends g.E {
  private TEXT_PADDING = 10;
  private background: g.FilledRect;
  private arrow: g.FilledRect;
  private text: g.Label;

  constructor(params: {
    scene: g.Scene;
    text: string;
  }) {
    super({
      scene: params.scene
    });
    this.text = new g.Label({
      scene: params.scene,
      text: params.text,
      font: new g.DynamicFont({
        game: params.scene.game,
        fontFamily: g.FontFamily.SansSerif,
        size: 14
      }),
      fontSize: 14,
      x: this.TEXT_PADDING,
      y: this.TEXT_PADDING
    });
    this.background = new g.FilledRect({
      scene: params.scene,
      cssColor: '#ffffff',
      width: this.text.width + this.TEXT_PADDING * 2,
      height: this.text.height + this.TEXT_PADDING * 2
    });
    this.arrow = new g.FilledRect({
      scene: params.scene,
      cssColor: '#ffffff',
      width: 24,
      height: 24,
      angle: 45,
      x: (this.background.width - 24) / 2,
      y: this.background.height - 12
    });
    this.append(this.arrow);
    this.append(this.background);
    this.append(this.text);
    this.width = this.background.width;
    this.height = this.background.height;
    this.modified();
  }
}

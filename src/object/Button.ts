export class Button extends g.E {
  private PADDING = 10;
  private BORDER_WIDTH = 2;

  constructor(params: {
    scene: g.Scene;
    labelText: string;
  }) {
    super({
      scene: params.scene,
      touchable: true
    });
    const label = new g.Label({
      scene: params.scene,
      text: params.labelText,
      font: new g.DynamicFont({
        game: params.scene.game,
        fontFamily: g.FontFamily.SansSerif,
        size: 14
      }),
      fontSize: 14,
      x: this.PADDING + this.BORDER_WIDTH,
      y: this.PADDING + this.BORDER_WIDTH
    });
    const background1 = new g.FilledRect({
      scene: params.scene,
      cssColor: '#000000',
      width: label.width + this.PADDING * 2 + this.BORDER_WIDTH * 2,
      height: label.height + this.PADDING * 2 + this.BORDER_WIDTH * 2
    });
    this.append(background1);
    const background2 = new g.FilledRect({
      scene: params.scene,
      cssColor: '#ffffff',
      width: label.width + this.PADDING * 2,
      height: label.height + this.PADDING * 2,
      x: this.BORDER_WIDTH,
      y: this.BORDER_WIDTH
    });
    this.append(background2);
    this.append(label);
    this.width = background1.width;
    this.height = background1.height;
    this.modified();
  }
}

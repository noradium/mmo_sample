export class Background extends g.FilledRect {
  constructor(params: {
    scene: g.Scene
  }) {
    super({
      scene: params.scene,
      cssColor: '#d6e9ca',
      width: params.scene.game.width,
      height: params.scene.game.height,
      touchable: true
    });
  }
}

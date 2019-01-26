import {MainScene} from './scene/MainScene';

function main(param: g.GameMainParameterObject): void {
  const scene = new MainScene({
    game: g.game,
    assetIds: ['akari', 'akane', 'aoi']
  });
  g.game.pushScene(scene);
}

export = main;

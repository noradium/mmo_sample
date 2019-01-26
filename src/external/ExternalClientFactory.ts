import {RPGAtsumaruClient} from './RPGAtsumaruClient';
import {MockExternalClient} from './MockExternalClient';

export namespace ExternalClientFactory {
  export function create(scene: g.Scene) {
    if (typeof RPGAtsumaru !== 'undefined') {
      return new RPGAtsumaruClient(scene);
    }
    return new MockExternalClient(scene);
  }
}

export namespace Util {
  export function queryParse(data: string) {
    const parsed = data.split('&').map(v => v.split('='));
    const result: any = {};
    parsed.forEach(v => {
      result[v[0]] = v[1];
    });
    return result;
  }

  export function queryStringify(data: any) {
    return Object.keys(data).map(k => `${k}=${data[k]}`).join('&');
  }
}

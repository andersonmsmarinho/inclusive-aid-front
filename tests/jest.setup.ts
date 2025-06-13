/*
  Mocks o SDK Parse de maneira simples, evitando chamadas reais ao Back4App.
  Os testes podem sobrescrever implementações conforme necessidade.
*/

class MockParseObject {
  private _attrs: Record<string, any> = {};
  public id?: string;
  constructor(private _className: string) {}

  static extend(className: string) {
    return class extends MockParseObject {
      constructor() { super(className); }
    };
  }
  set(key: string, value: any) { this._attrs[key] = value; }
  get(key: string) { return this._attrs[key]; }
  toJSON() { return this._attrs; }
  save() { this.id = this.id || Math.random().toString(36).substring(2); return Promise.resolve(this); }
  destroy() { return Promise.resolve(this); }
}

class MockQuery {
  private store: MockParseObject[] = [];
  constructor(private _cls: any) {}
  find() { return Promise.resolve(this.store); }
  get(id: string) { const obj = this.store.find(o => o.id === id); return obj ? Promise.resolve(obj) : Promise.reject(new Error('not found')); }
  // permite inserir objetos manualmente em testes
  _push(obj: MockParseObject) { this.store.push(obj); }
}

// Exporta objeto que imita parse/node
const ParseMock = {
  initialize: jest.fn(),
  serverURL: '',
  Object: MockParseObject,
  Query: MockQuery,
};

// Registra no Jest
jest.mock('parse/node', () => {
  return ParseMock;
});

export {}; 
import Parse from 'parse/node';

// A classe será a mockada pela jest.setup
const Profile = Parse.Object.extend('AccessibilityProfile');

describe('Parse Mock básico', () => {
  it('cria e salva objeto sem acessar rede', async () => {
    const p = new Profile();
    p.set('needs', ['visual']);
    p.set('features', { 'Ativar narração': true });
    const saved = await p.save();
    expect(saved.id).toBeDefined();
    expect(saved.get('needs')).toEqual(['visual']);
  });

  it('consulta via Query.find() usando mock', async () => {
    const query = new Parse.Query(Profile);
    const results = await query.find();
    // O mock não possui dados persistidos entre testes por padrão
    expect(Array.isArray(results)).toBe(true);
  });
}); 
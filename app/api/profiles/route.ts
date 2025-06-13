import { NextResponse } from 'next/server';
import { getParse } from '../../lib/parseServer';

// Objeto Parse e classe
const Parse = getParse();
const Profile = Parse.Object.extend('AccessibilityProfile');

export async function GET() {
  try {
    const query = new Parse.Query(Profile);
    const results = await query.find((Parse as any).masterKey ? { useMasterKey: true } : undefined);
    const data = results.map((p: any) => ({
      id: p.id,
      needs: p.get('needs') as string[],
      features: p.get('features') as Record<string, boolean>,
    }));
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[API] GET /profiles erro', err);
    return NextResponse.json({ error: 'Falha ao buscar perfis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { needs, features } = await request.json();
    const profile = new Profile();
    profile.set('needs', needs);
    profile.set('features', features);
    await profile.save(null, (Parse as any).masterKey ? { useMasterKey: true } : undefined);

    return NextResponse.json({ id: profile.id }, { status: 201 });
  } catch (err: any) {
    console.error('[API] POST /profiles erro', err);
    return NextResponse.json({ error: 'Falha ao criar perfil' }, { status: 500 });
  }
} 
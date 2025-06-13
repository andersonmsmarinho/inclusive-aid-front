import { NextResponse } from 'next/server';
import { getParse } from '../../../lib/parseServer';

const Parse = getParse();
const Profile = Parse.Object.extend('AccessibilityProfile');

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const query = new Parse.Query(Profile);
    const p = await query.get(params.id, (Parse as any).masterKey ? { useMasterKey: true } : undefined);
    return NextResponse.json({ id: p.id, needs: p.get('needs'), features: p.get('features') });
  } catch (err: any) {
    console.error('[API] GET /profiles/:id erro', err);
    return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { needs, features } = await req.json();
    const query = new Parse.Query(Profile);
    const p = await query.get(params.id, (Parse as any).masterKey ? { useMasterKey: true } : undefined);
    if (needs) p.set('needs', needs);
    if (features) p.set('features', features);
    await p.save(null, (Parse as any).masterKey ? { useMasterKey: true } : undefined);
    return NextResponse.json({ id: p.id });
  } catch (err: any) {
    console.error('[API] PUT /profiles/:id erro', err);
    return NextResponse.json({ error: 'Falha ao atualizar perfil' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const query = new Parse.Query(Profile);
    const p = await query.get(params.id, (Parse as any).masterKey ? { useMasterKey: true } : undefined);
    await p.destroy((Parse as any).masterKey ? { useMasterKey: true } : undefined);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[API] DELETE /profiles/:id erro', err);
    return NextResponse.json({ error: 'Falha ao remover perfil' }, { status: 500 });
  }
} 
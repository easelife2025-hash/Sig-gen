import { NextResponse } from 'next/server';
import * as opentype from 'opentype.js';

export async function GET() {
  return NextResponse.json({ 
    keys: Object.keys(opentype),
    hasParse: typeof opentype.parse === 'function',
    defaultKeys: opentype.default ? Object.keys(opentype.default) : null,
  });
}

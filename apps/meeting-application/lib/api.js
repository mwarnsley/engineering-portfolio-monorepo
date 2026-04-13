import { NextResponse } from 'next/server';

export function successResponse(data, init) {
  return NextResponse.json(data, init);
}

export function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

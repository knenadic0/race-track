import { racesRoute } from '@constants/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authenticationMiddleware = async (req: NextRequest) => {
	if (req.nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL(racesRoute, req.url));
	}
};

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
};

export default authenticationMiddleware;

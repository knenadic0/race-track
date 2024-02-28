import { loginRoute, racesRoute } from '@constants/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authenticationMiddleware = async (req: NextRequest) => {
	const user = req.cookies.get('user');
	if (req.nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL(racesRoute, req.url));
	}

	if (user && req.nextUrl.pathname.includes(loginRoute)) {
		return NextResponse.redirect(new URL(racesRoute, req.url));
	} else if (user || req.nextUrl.pathname.includes(loginRoute)) {
		return NextResponse.next();
	} else {
		return NextResponse.redirect(new URL(loginRoute, req.url));
	}
};

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
};

export default authenticationMiddleware;

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authenticationMiddleware = async (
	req: NextRequest,
	res: NextResponse,
) => {
	const user = req.cookies.get("user");

	if (user && req.nextUrl.pathname.includes("/login")) {
		return NextResponse.redirect(new URL("/", req.url));
	} else if (user || req.nextUrl.pathname.includes("/login")) {
		return NextResponse.next();
	} else {
		return NextResponse.redirect(new URL("/login", req.url));
	}
};

export const config = {
	matcher: "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
};

export default authenticationMiddleware;

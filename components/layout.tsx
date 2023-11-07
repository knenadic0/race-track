import React, { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<header className="flex h-16 items-center justify-center bg-white text-lg"></header>
			<main className="full-h-layout">{children}</main>
			<footer className="flex h-16 items-center justify-center bg-white text-lg">
				<p>Karlo Nenadic © 2023.</p>
			</footer>
		</>
	);
};

export default Layout;

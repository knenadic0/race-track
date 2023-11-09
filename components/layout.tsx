import React, { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";
import { Toaster } from "react-hot-toast";
import tailwindTheme from "../services/tailwind";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<div>
				<Toaster
					position="bottom-right"
					reverseOrder={false}
					toastOptions={{
						style: {
							borderRadius: "10px",
							background: "#333",
							color: "#fff",
						},
					}}
				/>
			</div>
			<Header />
			<main className="full-h-layout">{children}</main>
			<Footer />
		</>
	);
};

export default Layout;

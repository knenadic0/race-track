import type { NextPage } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../services/firebase";
import Cookies from "js-cookie";

const Home: NextPage = () => {
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  const logOut = () => {
    auth.signOut();
    Cookies.remove("user");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>RaceTrack</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center">
        <div className="flex items-center justify-center bg-white rounded shadow-lg">
          <div className="bg-race-flag bg-cover bg-no-repeat bg-bt-100 p-8 sm:w-80">
            <h1 className="text-4xl font-bold mb-6">RaceTrack</h1>
            <p>You are already logged in as {user && user.displayName}.</p>
            <button
              onClick={logOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

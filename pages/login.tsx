import type { NextPage } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../services/firebase";

const Login: NextPage = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          const user = result.user;
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
            <h1 className="text-3xl font-bold mb-8">RaceTrack</h1>
            {user ? (
              <>
                <p>You are already logged in as {user.displayName}.</p>
                <button
                  onClick={() => auth.signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-rt-blue text-white px-4 py-2 rounded-md hover:bg-rt-dark-blue"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

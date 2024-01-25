import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
	credential: cert(process.env.FIREBASE_ADMIN_PATH),
};

const adminApp = () => {
	if (!getApps().length) {
		return initializeApp(firebaseAdminConfig);
	}
	return getApps().at(0);
};
const adminAuth = getAuth(adminApp());
const adminFirestore = getFirestore(adminApp()!);

export { adminApp, adminAuth, adminFirestore };

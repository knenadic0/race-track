import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAZFEWUlM_adq5foq0fIrURrKHC3gz-38E',
	authDomain: 'racetrack-381816.firebaseapp.com',
	projectId: 'racetrack-381816',
	storageBucket: 'racetrack-381816.appspot.com',
	messagingSenderId: '887245248891',
	appId: '1:887245248891:web:88cc07a460a38c674945de',
	measurementId: 'G-46VVV14JJY',
};

const app = firebase.initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };

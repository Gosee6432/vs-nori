// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase 웹 앱 설정 정보 (너가 방금 복사한 내용)
const firebaseConfig = {
  apiKey: 'AIzaSyDlgFRziSnj5XpsJVAe2xnu7JCmt8U8tPw',
  authDomain: 'vs-nori2.firebaseapp.com',
  projectId: 'vs-nori2',
  storageBucket: 'vs-nori2.firebasestorage.app',
  messagingSenderId: '45618276233',
  appId: '1:45618276233:web:4ae46ea928dbc5bfd06358',
};

// 이미 초기화된 앱이 있다면 재사용, 없으면 새로 초기화
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore 인스턴스 export
export const db = getFirestore(app);

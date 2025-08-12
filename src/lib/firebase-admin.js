import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

function ensureInitialized() {
    if (!getApps().length) {
        if (!projectId || !clientEmail || !privateKey) {
            // 지연 초기화: 실제 사용 시점까지 에러를 미룸. 라우트 호출 시점에만 검증.
            throw new Error(
                'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.'
            );
        }

        initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }
}

export function getDb() {
    ensureInitialized();
    return getFirestore();
}

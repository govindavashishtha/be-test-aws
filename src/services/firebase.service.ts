import * as admin from 'firebase-admin';
import { BaseService } from './base.service';


export class FirebaseService extends BaseService<any, any, any, any> {
  private static instance: FirebaseService;
  private app!: admin.app.App;

  private constructor() {
    super(null as any, null as any);
    this.initializeApp();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private initializeApp() {
    try {
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      }
      this.app = admin.initializeApp(firebaseConfig);
      // this.app = admin.initializeApp({
      //   credential: admin.credential.cert({
      //     projectId: process.env.FIREBASE_PROJECT_ID,
      //     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      //   }),
      //   databaseURL: process.env.FIREBASE_DATABASE_URL,
      // });
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  public async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.app.auth().verifyIdToken(idToken);
  }

  public async generateCustomToken(uid: string): Promise<string> {
    return this.app.auth().createCustomToken(uid);
  }

  public async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    return this.app.auth().getUserByEmail(email);
  }

  public async getUserById(uid: string): Promise<admin.auth.UserRecord> {
    return this.app.auth().getUser(uid);
  }
} 
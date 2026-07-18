import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, onSnapshot, Timestamp, setDoc } from "firebase/firestore";

export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  membershipStatus: "None" | "Elite";
  membershipPurchaseDate?: Timestamp | Date;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  rfidCode?: string;
  createdAt: Timestamp | Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);

        // Listen for real-time updates to the user's document
        unsubscribeDoc = onSnapshot(
          userDocRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as Partial<UserData>;
              // If the backend webhook created the document first, it might be missing name/email
              if (!data.name || !data.email) {
                const mergedData = {
                  ...data,
                  name: data.name || currentUser.displayName || currentUser.email?.split("@")[0] || "Member",
                  email: data.email || currentUser.email || "",
                  role: data.role || "user",
                  createdAt: data.createdAt || new Date(),
                };
                await setDoc(userDocRef, mergedData, { merge: true });
                setUserData(mergedData as UserData);
              } else {
                setUserData(data as UserData);
              }
            } else {
              // Create the document if it doesn't exist
              const newUserData: Partial<UserData> = {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email?.split("@")[0] || "Member",
                email: currentUser.email || "",
                phone: "",
                role: "user",
                membershipStatus: "None",
                createdAt: new Date(),
              };
              try {
                await setDoc(userDocRef, newUserData);
              } catch (e) {
                console.error("Could not create user document:", e);
              }
              setUserData(newUserData as UserData);
            }
            setLoading(false);
          },
          (error) => {
            // Handle permission errors gracefully
            console.error("Firestore snapshot error:", error.code);
            setLoading(false);
          }
        );
      } else {
        setUserData(null);
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { Loader2 } from "lucide-react";
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
  cardStatus?: string;
  upgradeTokens?: string[];
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
              // W10: Guard against infinite loop if email is empty string.
              // Check if name or email are strictly undefined, or if we need to set defaults.
              const needsName = data.name === undefined || data.name === "";
              const needsEmail = data.email === undefined; // Empty string is a valid fallback for email

              if (needsName || needsEmail) {
                const mergedData = {
                  ...data,
                  name: data.name || currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Member"),
                  email: data.email ?? currentUser.email ?? "",
                  role: data.role || "user",
                  createdAt: data.createdAt || new Date(),
                };
                
                // Only write if something actually changed to prevent loop
                if (mergedData.name !== data.name || mergedData.email !== data.email) {
                  await setDoc(userDocRef, mergedData, { merge: true });
                }
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
      {loading ? (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <p className="text-cyan-400 font-mono tracking-widest uppercase text-sm animate-pulse">Initializing</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

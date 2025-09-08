import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client";

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

const errorMap = {
  PGRST302: "Invalid credentials. Please check your email or password.",
  PGRST301: "Check email or password and try again.",
  PGRST303: "Your session has expired. Please log in again.",
  PGRST304: "Permission denied. You do not have access to this resource.",
  PGRST305: "Please wait and try again later.",
  PGRST307: "Invalid email format.",
  PGRST308: "Password is too weak. Please use a stronger password.",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState(null);
  const [supabaseError, setSupabaseError] = useState(null);

  // Get initial user and set up auth state listener
  useEffect(() => {
    // Get initial session
    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);

      if (session?.user) {
        // await setUserWithVendorData(session.user);
        console.log(session.user);
      } else {
        setUser(null);
        setVendorData(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Get initial session on mount
  async function getInitialSession() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting user:", error);

        setLoading(false);
        return;
      }

      if (user) {
        // await setUserWithVendorData(user);
        console.log(user);
      }
    } catch (error) {
      console.error("Error in getInitialSession:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Set user and fetch vendor data if exists
    async function setUserWithVendorData() {
      // setUser(authUser);

      try {
        const { data: vendorData, error } = await supabase
          .from("vendors")
          .select("*")
          .single();
        console.log(vendorData);

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows returned, which is fine
          console.error("Error fetching vendor data:", error);
          return;
        }

        if (vendorData) {
          setVendorData(vendorData);
          console.log(vendorData);
          // Add vendor_id to user object
          setUser((prev) => ({ ...prev, vendor_id: vendorData.vendor_id }));
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    }

    setUserWithVendorData();
  }, []);

  // Login function
  const login = async (formData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        const friendlyMessage =
          errorMap[error.code] || "Something went wrong. Please try again.";

        setSupabaseError(friendlyMessage);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  // const signup = async (email, password, userData = {}) => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: userData, // Additional user metadata
  //       },
  //     });

  //     if (error) throw error;

  //     return { data, error: null };
  //   } catch (error) {
  //     console.error("Signup error:", error);
  //     return { data: null, error };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setVendorData(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    vendorData,
    loading,
    login,
    supabaseError,
    // signup,
    logout,

    // Helper functions
    isVendor: !!vendorData,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

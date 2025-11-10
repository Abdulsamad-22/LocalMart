import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

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
  const [session, setSession] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [supabaseError, setSupabaseError] = useState(null);
  const navigate = useNavigate();

  // Yup schema
  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(12).required("Password is required"),
  });

  // Updated user state change and get initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        console.log("user session expired");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      return {
        isValid: !!session,
        session,
        user: session?.user,
      };
    } catch (error) {
      console.error("Session check error:", error);
      return { isValid: false, error: error.message };
    }
  };

  useEffect(() => {
    // Set user and fetch vendor data if exists
    async function setUserWithVendorData() {
      // setUser(authUser);

      try {
        const { data: vendorData, error } = await supabase
          .from("vendors")
          .select("*")
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows returned, which is fine
          console.error("Error fetching vendor data:", error);
          return;
        }

        if (vendorData) {
          setVendorData(vendorData);
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
          errorMap?.[error.code] || "Invalid email or password.";
        setSupabaseError(friendlyMessage);
        return { success: false, data: null, error, user: null };
      }

      setUser(data.user);

      // Return success with user info
      return {
        success: true,
        data,
        error: null,
        user: data.user,
        isVendor: !!vendorData,
      };
    } catch (err) {
      console.error("Login error:", err);
      setSupabaseError("Unexpected error occurred. Please try again.");
      return { success: false, data: null, error: err, user: null };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      setLoading(false);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Error signing up:", error.message);
        const friendlyMessage =
          errorMap[error.code] || "Something went wrong. Please try again.";

        setSupabaseError(friendlyMessage);
        setLoading(true);
        return;
      }

      console.log("User signed up:", data);
      setUser(data.user);

      return {
        success: true,
        data,
        error: null,
        user: data.user,
      };
    } catch (err) {
      // console.error("Registration failed:", err.message);
      // console.error("Unexpected error during signup:", err);
      setSupabaseError("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    schema,
    supabaseError,
    session,
    checkSession,
    isAuthenticated: !!user,
    signup,
    logout,

    // Helper functions
    isVendor: !!vendorData,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

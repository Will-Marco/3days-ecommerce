"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface Seller {
  id: string;
  email: string;
  name: string;
}

interface SellerAuthContextType {
  seller: Seller | null;
  setSeller: (seller: Seller | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(
  undefined
);

const STORAGE_KEY = "seller_auth";

export function SellerAuthProvider({ children }: { children: ReactNode }) {
  const [seller, setSellerState] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load seller from localStorage on mount
    const storedSeller = localStorage.getItem(STORAGE_KEY);
    if (storedSeller) {
      try {
        const parsedSeller = JSON.parse(storedSeller);
        setSellerState(parsedSeller);
      } catch (error) {
        console.error("Error parsing seller from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const setSeller = (newSeller: Seller | null) => {
    setSellerState(newSeller);
    if (newSeller) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeller));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = () => {
    setSellerState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <SellerAuthContext.Provider
      value={{
        seller,
        setSeller,
        logout,
        isAuthenticated: !!seller,
      }}
    >
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  const context = useContext(SellerAuthContext);
  if (context === undefined) {
    throw new Error("useSellerAuth must be used within a SellerAuthProvider");
  }
  return context;
}

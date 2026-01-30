import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "guest" | "user" | "admin";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
};

const AppContext = createContext<Ctx>({} as Ctx);
export const useApp = () => useContext(AppContext);

export default function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  return (
    <AppContext.Provider value={{ role, setRole }}>
      {children}
    </AppContext.Provider>
  );
}

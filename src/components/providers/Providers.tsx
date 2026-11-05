"use client";

import React, { ReactNode } from "react";
import { WonderlandProvider } from "@/context/WonderlandContext";

export function Providers({ children }: { children: ReactNode }) {
  return <WonderlandProvider>{children}</WonderlandProvider>;
}


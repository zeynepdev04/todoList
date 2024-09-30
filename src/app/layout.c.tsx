"use client";
import { FC, ReactNode } from "react";
import { ReduxProvider } from "@/providers/ReduxProvider";

interface ILayoutClientProps {
  children: ReactNode;
}

const LayoutClient: FC<ILayoutClientProps> = ({ children }) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};

export default LayoutClient;

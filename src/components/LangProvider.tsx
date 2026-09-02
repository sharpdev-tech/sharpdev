"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LANG, type Lang } from "@/lib/lang";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** The active language. Server-resolved from the cookie, so it is correct on
 *  the first render rather than settling after hydration. */
export function useLang(): Lang {
  return useContext(LangContext);
}

/** Sugar for the copy objects each component defines. */
export function useCopy<T>(copy: Record<Lang, T>): T {
  return copy[useLang()];
}

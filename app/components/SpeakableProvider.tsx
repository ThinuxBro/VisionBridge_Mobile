import React, { createContext, useContext, useMemo, useRef, useEffect } from "react";
import { Text, TextProps } from "react-native";
import { TTS } from "../hooks/tts";

type Item = { id: string; text: string; order: number };
type Ctx = {
  register: (id: string, text: string, order?: number) => () => void;
  readScreen: (opts?: { haptic?: boolean; separator?: string }) => Promise<void>;
  stop: () => void;
};

const SpeakCtx = createContext<Ctx | null>(null);

export function SpeakableProvider({ children }: { children: React.ReactNode }) {
  const registry = useRef(new Map<string, Item>()).current;

  const register = (id: string, text: string, order = 0) => {
    registry.set(id, { id, text, order });
    return () => registry.delete(id);
  };

  const readScreen: Ctx["readScreen"] = async ({ haptic = true, separator = ". " } = {}) => {
    const items = [...registry.values()].sort((a, b) => a.order - b.order);
    const text = items.map(i => i.text).join(separator);
    await TTS.speak(text, { haptic });
  };

  const value = useMemo<Ctx>(() => ({ register, readScreen, stop: TTS.stop }), []);
  return <SpeakCtx.Provider value={value}>{children}</SpeakCtx.Provider>;
}

export function useReadScreen() {
  const ctx = useContext(SpeakCtx);
  if (!ctx) throw new Error("useReadScreen must be used inside <SpeakableProvider>");
  return ctx;
}

// Text that auto-registers its content
export function SpeakableText({
  children,
  order = 0,
  ...rest
}: TextProps & { children: string; order?: number }) {
  const id = React.useId();
  const ctx = useContext(SpeakCtx);

  useEffect(() => {
    if (!ctx) return;
    return ctx.register(id, String(children), order);
  }, [ctx, id, children, order]);

  return <Text {...rest}>{children}</Text>;
}

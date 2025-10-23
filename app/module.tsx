// app/module.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, findNodeHandle, Vibration } from "react-native";
import { router, Stack } from "expo-router";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

type Mod = { id: string; title: string; subtitle?: string };

const MODULES: Mod[] = [
  { id: "m1", title: "Orientation", subtitle: "Starts here" },
  { id: "m3", title: "Lessons", subtitle: "Structured learning" },
  { id: "m4", title: "Quizzes", subtitle: "Check your progress" },
  { id: "m5", title: "Help & Tips", subtitle: "Shortcuts and gestures" },
];

export default function ModulesScreen() {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const speakingRef = useRef(false);

  // store layout info for container and children
  const containerRef = useRef<View | null>(null);
  const containerAbsRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const itemLayoutsRef = useRef<Record<number, { x: number; y: number; width: number; height: number }>>({});
  const itemRefs = useRef<Array<View | null>>(Array(MODULES.length).fill(null));

  // prevent repeated announcements while finger remains on same item
  const lastAnnouncedRef = useRef<number>(-1);
  const lastAnnouncedTimeRef = useRef<number>(0);
  const ANNOUNCE_MIN_MS = 6000; // minimum ms between announcements for same item

  const safeSpeak = useCallback(async (text: string) => {
    if (!text) return;
    try {
      if (speakingRef.current) {
        Speech.stop();
      }
      speakingRef.current = true;
      // small haptic before speaking
      try {
        await Haptics.selectionAsync();
      } catch {}
      Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => { speakingRef.current = false; },
        onStopped: () => { speakingRef.current = false; },
        onError: () => { speakingRef.current = false; },
      });
    } catch {
      speakingRef.current = false;
    }
  }, []);

  const focusAndAnnounce = useCallback((index: number) => {
    if (index < 0 || index >= MODULES.length) return;
    setFocusedIndex(index);
    safeSpeak(MODULES[index].title);
  }, [safeSpeak]);

  // navigation
  const goHome = useCallback(() => {
    try { Speech.stop(); } catch {}
   // vibrate 200ms

    Haptics.selectionAsync().catch(() => {});
    router.push("/");
  }, []);

  // measure container absolute position each time layout changes
  const measureContainer = () => {
    const node = containerRef.current ? findNodeHandle(containerRef.current) : null;
    if (!node) return;
    // @ts-ignore measure is available on native node handle
    // measure returns (fx, fy, w, h, px, py)
    (containerRef.current as any).measure?.((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      containerAbsRef.current = { x: px, y: py, width, height };
    });
  };

  // when a child layout changes, store layout relative to container (we use native onLayout values)
  const onItemLayout = (idx: number, e: any) => {
    // e.nativeEvent.layout gives x,y relative to immediate parent (our list container)
    const { x, y, width, height } = e.nativeEvent.layout;
    itemLayoutsRef.current[idx] = { x, y, width, height };
    // measure container absolute too (defensive)
    measureContainer();
  };

  // call this to announce when finger enters a module
  const announceIndex = (idx: number) => {
    const now = Date.now();
    if (idx === lastAnnouncedRef.current && now - lastAnnouncedTimeRef.current < ANNOUNCE_MIN_MS) {
      return;
    }
    lastAnnouncedRef.current = idx;
    lastAnnouncedTimeRef.current = now;
    // haptic + TTS
    Haptics.selectionAsync().catch(() => {});
    safeSpeak(MODULES[idx].title);
    setFocusedIndex(idx);
  };

  // handle continuous move: pageX, pageY are absolute coordinates on screen
  const handleMove = (pageX?: number, pageY?: number) => {
    if (pageX == null || pageY == null) return;
    const cont = containerAbsRef.current;
    if (!cont) return;
    // Test every item: compute absolute rect = container px/py + child relative x/y
    for (let i = 0; i < MODULES.length; i++) {
      const child = itemLayoutsRef.current[i];
      if (!child) continue;
      const left = cont.x + child.x;
      const top = cont.y + child.y;
      const right = left + child.width;
      const bottom = top + child.height;
      if (pageX >= left && pageX <= right && pageY >= top && pageY <= bottom) {
        // finger currently over item i
        runOnJS(announceIndex)(i);
        return; // announce first matched (stop looping)
      }
    }
    // if no item matched, reset lastAnnounced so next entry will announce
    lastAnnouncedRef.current = -1;
  };

  const handleEnd = () => {
    // reset so next swipe announces again
    lastAnnouncedRef.current = -1;
  };

  // Pan gesture to track finger across the entire screen
 const pan = useMemo(() =>
  Gesture.Pan()
    .minPointers(1)
    .onUpdate((e: any) => {
      const px = (e as any).absoluteX ?? (e as any).x ?? (e as any).pageX;
      const py = (e as any).absoluteY ?? (e as any).y ?? (e as any).pageY;
      runOnJS(handleMove)(px, py);
    })
    .onEnd(() => {
      runOnJS(handleEnd)();
    })
    .onFinalize(() => {   // ✅ use onFinalize instead of onCancel
      runOnJS(handleEnd)();
    }), []
);

  // left fling/back gesture (same as before)
  const back = useMemo(
    () =>
      Gesture.Fling()
        .direction(Directions.LEFT)
        .onEnd(() => {
          runOnJS(goHome)();
        }),
    [goHome]
  );

  const gestures = Gesture.Simultaneous(pan, back);

  // ensure we measure container on mount/size change
  useEffect(() => {
    const t = setTimeout(() => measureContainer(), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Modules" }} />
      <GestureDetector gesture={gestures}>
        <View
          ref={containerRef}
          style={styles.container}
          // onLayout also triggers container measurement
          onLayout={() => measureContainer()}
        >
      

          <View style={styles.list}>
            {MODULES.map((m, idx) => {
              const focused = idx === focusedIndex;
              return (
                <Pressable
                  key={m.id}
                  // ref={(r) => (itemRefs.current[idx] = r)}
                  onLayout={(e) => onItemLayout(idx, e)}
                  onPress={() => focusAndAnnounce(idx)}
                  style={[styles.row, focused && styles.rowFocused]}
                  accessibilityRole="button"
                  accessibilityLabel={m.title}
                  accessibilityState={{ selected: focused }}
                >
                  <Text style={styles.title}>{m.title}</Text>
                  {m.subtitle ? <Text style={styles.subtitle}>{m.subtitle}</Text> : null}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.hint}>
            Tip: Drag (swipe) your finger across the screen to explore — the app will speak and lightly vibrate each module as your finger passes over it. Swipe left anywhere to go back.
          </Text>
        </View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 16, paddingStart: 20 },
  header: { color: "white", fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 12 },
  list: { gap: 50
    , marginTop: 6 },
  row: {
    borderRadius: 14,
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: "#1c1c1e",
    borderWidth: 2,
    borderColor: "transparent",
  },
  rowFocused: { borderColor: "#5ac8fa", backgroundColor: "#000000" },
  title: { color: "white", fontSize: 18, fontWeight: "600" },
  subtitle: { color: "#ccc", fontSize: 14, marginTop: 2 },
  hint: { color: "#9a9a9a", fontSize: 12, textAlign: "center", marginTop: 16 },
});

import { LessonRepository } from "../../data/lessonRepository";
import { AudioTtsEngine } from "../engine/audioTtsEngine";
import { LessonSequencer } from "../engine/lessonSequencer";
import {
  loadLessonCursor,
  saveLessonCursor,
  clearLessonCursor,
} from "../engine/lessonProgressStore";

export class LessonPlayerController {
  private repo = new LessonRepository();
  private tts = new AudioTtsEngine();
  private sequencer: LessonSequencer;

  private cursorLoaded = false;
  private resumedFromSaved = false;

  constructor() {
    const segments = this.repo.getSegments();
    this.sequencer = new LessonSequencer(segments);
    this.restoreCursor();
  }

  private async restoreCursor() {
    const cursor = await loadLessonCursor();
    if (cursor && typeof cursor.segmentIndex === "number") {
      this.sequencer.goTo(cursor.segmentIndex);
      if (cursor.segmentIndex > 0) {
        this.resumedFromSaved = true;
      }
    }
    this.cursorLoaded = true;
  }

  private persistCursor() {
    if (!this.cursorLoaded) return;
    const idx = this.sequencer.index();
    saveLessonCursor({
      segmentIndex: idx,
      updatedAt: Date.now(),
    }).catch(() => {});
  }

  async start() {
    // If we resumed from a previous position, speak that first
    if (this.resumedFromSaved) {
      this.tts.speak(
        "Resuming from your last position in the lesson. Swipe right to continue, or double tap to hear this segment again."
      );
      this.resumedFromSaved = false;
      // small delay then speak actual segment
      setTimeout(() => {
        const seg = this.sequencer.current();
        if (seg) this.tts.speak(seg.text);
      }, 800);
      return;
    }

    const seg = this.sequencer.current();
    if (!seg) return;
    this.tts.speak(seg.text);
  }

  next() {
    const seg = this.sequencer.next();
    if (!seg) return;
    this.tts.speak(seg.text);
    this.persistCursor();
  }

  prev() {
    const seg = this.sequencer.prev();
    if (!seg) return;
    this.tts.speak(seg.text);
    this.persistCursor();
  }

  repeat() {
    const seg = this.sequencer.current();
    if (!seg) return;
    this.tts.speak(seg.text);
  }

  stop() {
    this.tts.stop();
  }

  async reset() {
    this.sequencer.goTo(0);
    await clearLessonCursor();
    this.persistCursor();
    this.tts.speak("Lesson restarted from the beginning.");
  }

  getIndex() {
    return this.sequencer.index();
  }
}

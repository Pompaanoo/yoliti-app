"use client";

import dynamic from "next/dynamic";
import type {
  Lesson,
  VideoData,
  TextData,
  QuizData,
  DragDropData,
  FlashcardsData,
  PdfData,
} from "@/lib/types";

const VideoPlayer    = dynamic(() => import("./interactive/VideoPlayer"),    { ssr: false });
const QuizPlayer     = dynamic(() => import("./interactive/QuizPlayer"),     { ssr: false });
const FlashcardPlayer = dynamic(() => import("./interactive/FlashcardPlayer"), { ssr: false });
const DragDropActivity = dynamic(() => import("./interactive/DragDropActivity"), { ssr: false });
const PdfViewer      = dynamic(() => import("./interactive/PdfViewer"),      { ssr: false });
const TextContent    = dynamic(() => import("./interactive/TextContent"),    { ssr: false });

export default function ChapterViewer({
  lesson,
  onComplete,
}: {
  lesson: Lesson;
  onComplete: (lessonId: string, pct: number) => void;
}) {
  const handleComplete = (pct: number) => onComplete(lesson.id, pct);
  const d = lesson.content_data;

  switch (lesson.content_type) {
    case "video":
      return (
        <VideoPlayer
          data={(d as VideoData) ?? { url: lesson.video_url ?? "" }}
          onComplete={handleComplete}
        />
      );

    case "texto":
      return (
        <TextContent
          data={(d as TextData) ?? { body: lesson.content ?? "" }}
          onComplete={handleComplete}
        />
      );

    case "quiz":
      return (
        <QuizPlayer
          data={(d as QuizData) ?? { questions: [] }}
          lessonId={lesson.id}
          onComplete={handleComplete}
        />
      );

    case "dragdrop":
      return (
        <DragDropActivity
          data={
            (d as DragDropData) ?? {
              instruction: "",
              items: [],
              zones: [],
              mapping: {},
            }
          }
          onComplete={handleComplete}
        />
      );

    case "flashcards":
      return (
        <FlashcardPlayer
          data={(d as FlashcardsData) ?? { cards: [] }}
          onComplete={handleComplete}
        />
      );

    case "pdf":
      return (
        <PdfViewer
          data={(d as PdfData) ?? { url: "" }}
          onComplete={handleComplete}
        />
      );

    default:
      return (
        <VideoPlayer
          data={{ url: lesson.video_url ?? "" }}
          onComplete={handleComplete}
        />
      );
  }
}

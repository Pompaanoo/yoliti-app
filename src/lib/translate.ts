import * as deepl from "deepl-node";

let _translator: deepl.Translator | null = null;

function getTranslator(): deepl.Translator {
  if (!_translator) {
    const key = process.env.DEEPL_API_KEY;
    if (!key) throw new Error("DEEPL_API_KEY is not set");
    _translator = new deepl.Translator(key);
  }
  return _translator;
}

export async function translateToEnglish(text: string): Promise<string> {
  if (!text.trim()) return "";
  const result = await getTranslator().translateText(text, "es", "en-US");
  return result.text;
}

export async function translateToSpanish(text: string): Promise<string> {
  if (!text.trim()) return "";
  const result = await getTranslator().translateText(text, "en", "es");
  return result.text;
}

/** Traduce y devuelve también el idioma detectado en la fuente ("en" | "es" | ...) */
export async function translateAutoDetect(
  text: string,
  targetLang: "en-US" | "es"
): Promise<{ text: string; sourceLang: string }> {
  if (!text.trim()) return { text: "", sourceLang: "" };
  const result = await getTranslator().translateText(text, null, targetLang);
  return { text: result.text, sourceLang: result.detectedSourceLang.toLowerCase() };
}

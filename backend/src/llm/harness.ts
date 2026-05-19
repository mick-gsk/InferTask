import { askOllamaStructured } from "./ollama.js";

/**
 * Konfiguration einer Harness-Instanz.
 *
 * TOutput: Der erwartete Output-Typ nach Validierung/Sanitization.
 */
export interface HarnessConfig<TOutput> {
  /** Name der Harness — erscheint in Logs. */
  name: string;

  /** Liefert den System-Prompt. Funktion statt Konstante für dynamische Werte (Datum etc.). */
  buildSystemPrompt: () => string;

  /** JSON Schema für Ollamas `format`-Constraint. */
  schema: Record<string, unknown>;

  /** Validiert und bereinigt die rohe LLM-Antwort.
   *  Darf das `raw`-Objekt mutieren (Soft-Fallbacks).
   *  Gibt null zurück wenn valide, sonst eine deutsche Fehlermeldung. */
  validateAndSanitize: (raw: Record<string, unknown>) => string | null;

  /** Mappt das validierte raw-Objekt auf den gewünschten Output-Typ. */
  mapOutput: (raw: Record<string, unknown>) => TOutput;

  /** Max. Anzahl Versuche bei transientem Fehler. Default: 2. */
  maxRetries?: number;
}

/** Harness-Fehler mit maschinenlesbarem Fehlertyp. */
export type HarnessErrorType =
  | "llm_unavailable"   // Ollama nicht erreichbar / alle Retries erschöpft
  | "validation_failed" // LLM-Antwort besteht K.O.-Prüfung nicht
  | "unknown";

export interface HarnessError {
  ok: false;
  errorType: HarnessErrorType;
  message: string;
}

export interface HarnessSuccess<TOutput> {
  ok: true;
  data: TOutput;
}

export type HarnessResult<TOutput> = HarnessSuccess<TOutput> | HarnessError;

/**
 * Generische Harness-Engine.
 *
 * Kapselt: Retry-Loop, Timeout-Delegation an askOllamaStructured,
 * Validierung/Sanitization, Output-Mapping und strukturiertes Logging.
 *
 * Verwendung:
 *   const result = await runHarness(intentCompilerHarness, userInput);
 *   if (!result.ok) { ... handle error ... }
 *   const task = result.data;
 */
export async function runHarness<TOutput>(
  config: HarnessConfig<TOutput>,
  userInput: string,
): Promise<HarnessResult<TOutput>> {
  const maxRetries = config.maxRetries ?? 2;
  const start = Date.now();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const log = (level: "info" | "warn" | "error", msg: string, extra?: unknown) => {
      const entry = {
        harness: config.name,
        attempt,
        latencyMs: Date.now() - start,
        msg,
        ...(extra ? { extra } : {}),
      };
      if (level === "error") console.error(JSON.stringify(entry));
      else if (level === "warn") console.warn(JSON.stringify(entry));
      else console.info(JSON.stringify(entry));
    };

    const raw = await askOllamaStructured(
      config.buildSystemPrompt(),
      userInput,
      config.schema,
    );

    if (raw === null) {
      log("warn", `LLM returned null`);
      if (attempt === maxRetries) {
        return {
          ok: false,
          errorType: "llm_unavailable",
          message: "LLM nicht verfügbar oder ungültiges JSON – läuft Ollama?",
        };
      }
      continue;
    }

    const validationError = config.validateAndSanitize(raw);
    if (validationError !== null) {
      log("error", `Validation failed: ${validationError}`);
      // Validierungsfehler sind deterministisch — kein Retry sinnvoll
      return {
        ok: false,
        errorType: "validation_failed",
        message: validationError,
      };
    }

    log("info", "Harness completed successfully");
    return { ok: true, data: config.mapOutput(raw) };
  }

  // Sollte durch den Loop nicht erreichbar sein, aber TS braucht den Return
  return { ok: false, errorType: "unknown", message: "Unbekannter Harness-Fehler" };
}

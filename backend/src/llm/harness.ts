import { askOllamaStructured } from "./ollama.js";

/**
 * Konfiguration einer Harness-Instanz.
 * TOutput: Der erwartete Output-Typ nach Validierung/Sanitization.
 */
export interface HarnessConfig<TOutput> {
  /** Name der Harness — erscheint in Logs. */
  name: string;

  /** Liefert den System-Prompt. Funktion für dynamische Werte (Datum, Kontext). */
  buildSystemPrompt: () => string;

  /** JSON Schema für Ollamas `format`-Constraint. */
  schema: Record<string, unknown>;

  /**
   * Validiert und bereinigt die rohe LLM-Antwort (darf mutieren).
   * Gibt null zurück wenn valide, sonst eine deutsche Fehlermeldung.
   */
  validateAndSanitize: (raw: Record<string, unknown>) => string | null;

  /** Mappt das validierte raw-Objekt auf den gewünschten Output-Typ. */
  mapOutput: (raw: Record<string, unknown>) => TOutput;

  /** Max. Anzahl Versuche bei transientem LLM-Fehler. Default: 2. */
  maxRetries?: number;
}

export type HarnessErrorType =
  | "llm_unavailable"
  | "validation_failed"
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

// ---------------------------------------------------------------------------
// Internes strukturiertes Logging
// ---------------------------------------------------------------------------

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  ts: string;          // ISO-Timestamp
  harness: string;
  attempt: number;
  latencyMs: number;
  level: LogLevel;
  event: string;       // maschinenlesbarer Event-Bezeichner
  msg: string;         // menschenlesbarer Text
  extra?: unknown;
}

function writeLog(entry: LogEntry): void {
  const line = JSON.stringify(entry);
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.info(line);
}

function makeLogger(harness: string, attempt: number, startMs: number) {
  return function log(
    level: LogLevel,
    event: string,
    msg: string,
    extra?: unknown,
  ): void {
    writeLog({
      ts: new Date().toISOString(),
      harness,
      attempt,
      latencyMs: Date.now() - startMs,
      level,
      event,
      msg,
      ...(extra !== undefined ? { extra } : {}),
    });
  };
}

// ---------------------------------------------------------------------------
// Generische Harness-Engine
// ---------------------------------------------------------------------------

/**
 * Führt eine konfigurierte Harness aus:
 * Retry-Loop, Validierung/Sanitization, Output-Mapping, strukturiertes Logging.
 *
 * Beispiel:
 *   const result = await runHarness(intentCompilerConfig, userInput);
 *   if (!result.ok) { handle(result.errorType, result.message); }
 *   const data = result.data;
 */
export async function runHarness<TOutput>(
  config: HarnessConfig<TOutput>,
  userInput: string,
): Promise<HarnessResult<TOutput>> {
  const maxRetries = config.maxRetries ?? 2;
  const startMs = Date.now();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const log = makeLogger(config.name, attempt, startMs);

    log("info", "harness.attempt.start", `Attempt ${attempt}/${maxRetries} gestartet`);

    const raw = await askOllamaStructured(
      config.buildSystemPrompt(),
      userInput,
      config.schema,
    );

    if (raw === null) {
      log("warn", "harness.llm.null", "LLM returned null");
      if (attempt === maxRetries) {
        log("error", "harness.llm.unavailable", "Alle Versuche erschöpft");
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
      // Validierungsfehler sind deterministisch — Retry wäre sinnlos
      log("error", "harness.validation.failed", validationError);
      return {
        ok: false,
        errorType: "validation_failed",
        message: validationError,
      };
    }

    log("info", "harness.success", `Harness erfolgreich abgeschlossen`);
    return { ok: true, data: config.mapOutput(raw) };
  }

  return { ok: false, errorType: "unknown", message: "Unbekannter Harness-Fehler" };
}

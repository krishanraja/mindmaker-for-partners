/**
 * Structured Logger Module
 * 
 * Provides a standardized logging format with levels, context, and timestamps.
 * All logs follow the format: { level, message, context, timestamp }
 * 
 * @module logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  timestamp: string;
  traceId?: string;
}

// Session-based trace ID for request correlation
let currentTraceId: string | null = null;

/**
 * Generate a unique trace ID for the current session
 */
export function generateTraceId(): string {
  currentTraceId = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  return currentTraceId;
}

/**
 * Get the current trace ID
 */
export function getTraceId(): string | null {
  return currentTraceId;
}

/**
 * Set the current trace ID (useful when receiving from API)
 */
export function setTraceId(traceId: string): void {
  currentTraceId = traceId;
}

/**
 * Create a structured log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context: LogContext = {}
): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
    ...(currentTraceId && { traceId: currentTraceId })
  };
}

/**
 * Format log entry for console output
 */
function formatForConsole(entry: LogEntry): string {
  const contextStr = Object.keys(entry.context).length > 0 
    ? ` | ${JSON.stringify(entry.context)}`
    : '';
  const traceStr = entry.traceId ? ` [${entry.traceId}]` : '';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()}${traceStr}: ${entry.message}${contextStr}`;
}

/**
 * Get the appropriate console method for the log level
 */
function getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
  switch (level) {
    case 'debug':
      return console.debug;
    case 'info':
      return console.info;
    case 'warn':
      return console.warn;
    case 'error':
    case 'critical':
      return console.error;
    default:
      return console.log;
  }
}

/**
 * Log a message at the specified level
 */
function log(level: LogLevel, message: string, context: LogContext = {}): LogEntry {
  const entry = createLogEntry(level, message, context);
  const consoleMethod = getConsoleMethod(level);
  
  // In development, use formatted output for readability
  if (import.meta.env.DEV) {
    consoleMethod(formatForConsole(entry));
  } else {
    // In production, output structured JSON for log aggregation
    consoleMethod(JSON.stringify(entry));
  }
  
  return entry;
}

/**
 * Logger interface with standard methods
 */
export const logger = {
  /**
   * Debug level - detailed information for development
   */
  debug: (message: string, context: LogContext = {}): LogEntry => 
    log('debug', message, context),
  
  /**
   * Info level - general operational information
   */
  info: (message: string, context: LogContext = {}): LogEntry => 
    log('info', message, context),
  
  /**
   * Warn level - potentially harmful situations
   */
  warn: (message: string, context: LogContext = {}): LogEntry => 
    log('warn', message, context),
  
  /**
   * Error level - error events that might still allow the app to continue
   */
  error: (message: string, context: LogContext = {}): LogEntry => 
    log('error', message, context),
  
  /**
   * Critical level - severe error events that will likely cause app failure
   */
  critical: (message: string, context: LogContext = {}): LogEntry => 
    log('critical', message, context),
  
  /**
   * Log an error with full error object details
   */
  logError: (
    message: string, 
    error: unknown, 
    additionalContext: LogContext = {}
  ): LogEntry => {
    const errorContext: LogContext = {
      ...additionalContext,
      errorType: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      ...(error instanceof Error && error.stack && { stack: error.stack })
    };
    return log('error', message, errorContext);
  },

  /**
   * Log a database operation with standard fields
   */
  logDbOperation: (
    operation: 'insert' | 'update' | 'delete' | 'select',
    table: string,
    success: boolean,
    context: LogContext = {}
  ): LogEntry => {
    const level: LogLevel = success ? 'info' : 'error';
    return log(level, `DB ${operation} on ${table}: ${success ? 'success' : 'failed'}`, {
      operation,
      table,
      success,
      ...context
    });
  },

  /**
   * Log an API call with standard fields
   */
  logApiCall: (
    method: string,
    endpoint: string,
    status: number,
    duration?: number,
    context: LogContext = {}
  ): LogEntry => {
    const level: LogLevel = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    return log(level, `API ${method} ${endpoint}: ${status}`, {
      method,
      endpoint,
      status,
      ...(duration !== undefined && { durationMs: duration }),
      ...context
    });
  },

  /**
   * Log an LLM interaction with standard fields
   */
  logLlmCall: (
    model: string,
    success: boolean,
    tokenUsage?: { prompt: number; completion: number },
    context: LogContext = {}
  ): LogEntry => {
    const level: LogLevel = success ? 'info' : 'error';
    return log(level, `LLM call to ${model}: ${success ? 'success' : 'failed'}`, {
      model,
      success,
      ...(tokenUsage && { 
        promptTokens: tokenUsage.prompt,
        completionTokens: tokenUsage.completion,
        totalTokens: tokenUsage.prompt + tokenUsage.completion
      }),
      ...context
    });
  }
};

// Initialize trace ID on module load
generateTraceId();

export default logger;

import { z } from 'zod';

/**
 * Core Domain Models for Agentik Context Engine (ACE)
 */

export const MessageRoleSchema = z.enum(['user', 'gemini', 'system']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const ThoughtSchema = z.object({
  subject: z.string(),
  description: z.string(),
  timestamp: z.string(),
});
export type Thought = z.infer<typeof ThoughtSchema>;

export const ToolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  args: z.any(),
  result: z.any().optional(),
});
export type ToolCall = z.infer<typeof ToolCallSchema>;

export const MessageSchema = z.object({
  id: z.string().optional(),
  role: MessageRoleSchema,
  content: z.string(),
  timestamp: z.string().optional(),
  thoughts: z.array(ThoughtSchema).optional(),
  toolCalls: z.array(ToolCallSchema).optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const TraceSchema = z.object({
  sessionId: z.string(),
  projectHash: z.string().optional(),
  startTime: z.string(),
  messages: z.array(MessageSchema),
});
export type Trace = z.infer<typeof TraceSchema>;

export const LessonSchema = z.object({
  type: z.enum(['pattern', 'error', 'gap', 'decision']),
  description: z.string(),
  evidence: z.string(), // Reference to message ID or code snippet
  recommendation: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
});
export type Lesson = z.infer<typeof LessonSchema>;

import React from 'react'
import type { ToolCallMessage } from '../store/sessions'

type Option = { label: string; description?: string }
type Question = {
  question: string
  header?: string
  options: Option[]
  multiSelect?: boolean
}

function parseQuestions(input: Record<string, unknown>): Question[] {
  const raw = input.questions
  if (!Array.isArray(raw)) return []
  return raw.filter((q): q is Question => !!q && typeof q === 'object' && 'question' in q)
}

export default function AskUserQuestionCard({
  message
}: {
  message: ToolCallMessage
}): React.JSX.Element {
  const questions = parseQuestions(message.input)
  const denied = message.denied === true

  return (
    <div className={`my-1 rounded-lg border text-xs overflow-hidden ${
      denied ? 'border-red-500/[0.12] bg-red-500/[0.03]' : 'border-line bg-overlay-1'
    }`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400/70 flex-shrink-0" />
        <span className="font-mono text-fg-faint w-3 text-center flex-shrink-0">?</span>
        <span className="font-medium text-fg-muted">Question</span>
        {denied && (
          <span className="text-[10px] text-red-400/50">denied</span>
        )}
        <span className="ml-auto text-[10px] text-fg-faint italic">
          Reply in chat to answer
        </span>
      </div>

      <div className="px-3 py-2 space-y-3">
        {questions.length === 0 && (
          <p className="text-fg-faint italic">(no questions provided)</p>
        )}
        {questions.map((q, qi) => (
          <div key={qi} className="space-y-1.5">
            {q.header && (
              <span className="inline-block text-[10px] uppercase tracking-wider text-fg-faint border border-line-soft rounded px-1.5 py-0.5">
                {q.header}
              </span>
            )}
            <p className="text-fg-muted leading-relaxed">{q.question}</p>
            {q.multiSelect && (
              <p className="text-[10px] text-fg-faint italic">Multiple answers allowed</p>
            )}
            {q.options?.length > 0 && (
              <ul className="space-y-1 mt-1">
                {q.options.map((opt, oi) => (
                  <li
                    key={oi}
                    className="rounded border border-line-soft px-2 py-1.5 bg-overlay-2/40"
                  >
                    <p className="text-fg-muted font-medium">{opt.label}</p>
                    {opt.description && (
                      <p className="text-[11px] text-fg-faint mt-0.5 leading-relaxed">
                        {opt.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

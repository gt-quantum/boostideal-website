import { useEffect, useRef, useState } from 'react';

type FormKey = 'name' | 'email' | 'company' | 'message';
type FormData = Record<FormKey, string>;
type Status = 'idle' | 'submitting' | 'ok' | 'error';

type Step = {
  key: FormKey;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required: boolean;
  autocomplete?: string;
};

const STEPS: Step[] = [
  { key: 'name', label: "What's your name?", type: 'text', required: true, autocomplete: 'name' },
  { key: 'email', label: "What's your email?", type: 'email', required: true, autocomplete: 'email' },
  { key: 'company', label: 'Which company?', type: 'text', required: false, autocomplete: 'organization' },
  { key: 'message', label: 'What can we help with?', type: 'textarea', required: false },
];

export default function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<FormData>({ name: '', email: '', company: '', message: '' });
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest('[data-open-contact]');
      if (trigger) {
        e.preventDefault();
        setOpen(true);
        setStep(0);
        setStatus('idle');
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) fieldRef.current?.focus();
  }, [step, open]);

  if (!open) return null;

  const current = STEPS[step];
  const value = data[current.key];
  const isLast = step === STEPS.length - 1;
  const canAdvance = !current.required || value.trim().length > 0;

  async function submit() {
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-popup-title"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-bg p-8 text-fg shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {status === 'ok' ? 'Done' : `Step ${step + 1} of ${STEPS.length}`}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close contact form"
            className="text-xl leading-none text-muted hover:text-fg"
          >
            ×
          </button>
        </div>

        {status === 'ok' ? (
          <div>
            <h2 id="contact-popup-title" className="text-2xl font-semibold">
              Thanks — we'll be in touch.
            </h2>
            <p className="mt-2 text-muted">We received your message.</p>
          </div>
        ) : (
          <>
            <h2 id="contact-popup-title" className="text-xl font-semibold">
              {current.label}
            </h2>

            {current.type === 'textarea' ? (
              <textarea
                ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
                value={value}
                onChange={(e) => setData({ ...data, [current.key]: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-border bg-bg px-3 py-2"
              />
            ) : (
              <input
                ref={fieldRef as React.RefObject<HTMLInputElement>}
                type={current.type}
                value={value}
                autoComplete={current.autocomplete}
                onChange={(e) => setData({ ...data, [current.key]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canAdvance) {
                    e.preventDefault();
                    if (isLast) submit();
                    else setStep(step + 1);
                  }
                }}
                className="w-full rounded-md border border-border bg-bg px-3 py-2"
              />
            )}

            {status === 'error' && (
              <p role="alert" className="text-sm text-red-700">
                Something went wrong. Try again.
              </p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="text-sm text-muted disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLast) submit();
                  else setStep(step + 1);
                }}
                disabled={!canAdvance || status === 'submitting'}
                className="rounded-md bg-accent px-5 py-2.5 font-medium text-accent-fg disabled:opacity-50"
              >
                {status === 'submitting' ? 'Sending…' : isLast ? 'Send' : 'Continue'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

type FormKey = 'firstName' | 'workEmail' | 'companyName' | 'accountsCount';
type FormData = Record<FormKey, string>;
type Status = 'idle' | 'submitting' | 'ok' | 'error';

type Step = {
  key: FormKey;
  label: string;
  type: 'text' | 'email';
  required: boolean;
  autocomplete?: string;
  placeholder?: string;
};

const OVERALL_HEADLINE = 'Show us your accounts. We will show you what matters.';
const SUBMIT_LABEL = "Show Me What I'm Missing";
const REASSURANCE = 'No spam. No hard sell. Just a clear look at your data.';

const STEPS: Step[] = [
  { key: 'firstName', label: "What's your first name?", type: 'text', required: true, autocomplete: 'given-name' },
  { key: 'workEmail', label: "What's your work email?", type: 'email', required: true, autocomplete: 'email' },
  { key: 'companyName', label: 'What company?', type: 'text', required: true, autocomplete: 'organization' },
  {
    key: 'accountsCount',
    label: 'How many accounts are you currently managing in HubSpot?',
    type: 'text',
    required: false,
    placeholder: 'Optional — rough number is fine',
  },
];

export default function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<FormData>({
    firstName: '',
    workEmail: '',
    companyName: '',
    accountsCount: '',
  });
  const fieldRef = useRef<HTMLInputElement | null>(null);

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              {status === 'ok' ? 'Done' : `Step ${step + 1} of ${STEPS.length}`}
            </p>
            <h2 id="contact-popup-title" className="mt-1 text-lg font-semibold leading-snug">
              {OVERALL_HEADLINE}
            </h2>
          </div>
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
            <p className="text-xl font-semibold">Thanks — we'll be in touch.</p>
            <p className="mt-2 text-muted">
              We received your info and will review your accounts shortly.
            </p>
          </div>
        ) : (
          <>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted">{current.label}</span>
              <input
                ref={fieldRef}
                type={current.type}
                value={value}
                placeholder={current.placeholder}
                autoComplete={current.autocomplete}
                onChange={(e) => setData({ ...data, [current.key]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canAdvance) {
                    e.preventDefault();
                    if (isLast) submit();
                    else setStep(step + 1);
                  }
                }}
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-base"
              />
            </label>

            {status === 'error' && (
              <p role="alert" className="text-sm text-red-700">
                Something went wrong. Try again.
              </p>
            )}

            <div className="flex flex-col gap-2">
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
                  {status === 'submitting'
                    ? 'Sending…'
                    : isLast
                      ? SUBMIT_LABEL
                      : 'Continue'}
                </button>
              </div>
              {isLast && (
                <p className="text-xs text-muted">{REASSURANCE}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

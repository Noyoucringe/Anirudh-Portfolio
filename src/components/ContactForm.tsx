import { useEffect, useRef, useState, type FormEvent } from 'react';
import { profile } from '../data/profile';
import { Arrow } from './Primitives';

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error';
const fields: Field[] = ['name', 'email', 'message'];

function validate(field: Field, value: string) {
  if (field === 'name' && value.length < 2) return 'Enter at least two characters for your name.';
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Enter a valid email address.';
  if (field === 'message' && value.length < 12)
    return 'Add a little detail (at least 12 characters).';
}

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const pending = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
    return () => pending.current?.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const body = new FormData(form);
    const next: Errors = {};
    for (const field of fields) {
      const value = String(body.get(field) || '').trim();
      body.set(field, value);
      const error = validate(field, value);
      if (error) next[field] = error;
    }
    setErrors(next);
    const invalid = fields.find((field) => next[field]);
    if (invalid) {
      setStatus('idle');
      (form.elements.namedItem(invalid) as HTMLElement)?.focus();
      return;
    }
    const controller = new AbortController();
    pending.current = controller;
    const timer = window.setTimeout(() => controller.abort(), 18000);
    setStatus('sending');
    try {
      const response = await fetch(profile.contactEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Delivery failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timer);
      pending.current = null;
    }
  }

  function fieldProps(field: Field) {
    return {
      name: field,
      id: 'contact-' + field,
      required: true,
      minLength: field === 'message' ? 12 : field === 'name' ? 2 : undefined,
      readOnly: status === 'sending',
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': errors[field] ? field + '-error' : undefined,
      onBlur: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.currentTarget.value.trim();
        if (value) setErrors((previous) => ({ ...previous, [field]: validate(field, value) }));
      },
      onChange: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.currentTarget.value.trim();
        if (errors[field])
          setErrors((previous) => ({ ...previous, [field]: validate(field, value) }));
        if (status !== 'idle') setStatus('idle');
      },
    };
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      method="post"
      action={profile.contactEndpoint}
      onSubmit={submit}
      aria-label="Send a message"
    >
      <div className="form-pair">
        {(['name', 'email'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={'contact-' + field}>
              {field === 'name' ? 'Your name' : 'Email address'}
            </label>
            <input
              {...fieldProps(field)}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field}
            />
            {errors[field] && (
              <p id={field + '-error'} className="form-error">
                {errors[field]}
              </p>
            )}
          </div>
        ))}
      </div>
      <label htmlFor="contact-message">Your message</label>
      <textarea {...fieldProps('message')} rows={3} />
      {errors.message && (
        <p id="message-error" className="form-error">
          {errors.message}
        </p>
      )}
      <button className="action action-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <Arrow direction="up-right" />
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status === 'success' && 'Message sent. Thank you for getting in touch.'}
        {status === 'error' && (
          <>
            Your message couldn’t be sent. Try again or{' '}
            <a href={'mailto:' + profile.email}>email me directly</a>.
          </>
        )}
      </p>
    </form>
  );
}

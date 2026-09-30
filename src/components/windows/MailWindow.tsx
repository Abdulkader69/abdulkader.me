'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FiSend,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiMessageSquare,
} from 'react-icons/fi';
import AppWindow from '../AppWindow';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  botField: string;
}

const initialForm: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  botField: '',
};

export default function MailWindow({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (status === 'submitting') return;

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setStatus('error');
      setErrorMessage('Please fill in all fields before sending.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(
          data.error || 'Failed to send message. Please try again.',
        );
      }

      setStatus('success');
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    // Send with Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AppWindow
      title="New Message — Mail"
      onClose={onClose}
      widthClass="w-[680px] max-w-[94vw]"
      heightClass="h-[540px] max-h-[85vh]"
    >
      <div className="flex h-full flex-col bg-white/70 text-slate-800 backdrop-blur-xl dark:bg-neutral-900/80 dark:text-neutral-100">
        {/* Mail Toolbar */}
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={status === 'submitting' || status === 'success'}
              className="group flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <FiRefreshCw className="animate-spin" size={13} />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FiSend
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                  <span>Send</span>
                  <span className="hidden text-[10px] opacity-75 sm:inline">
                    ⌘↵
                  </span>
                </>
              )}
            </button>

            {status === 'idle' && (
              <span className="text-[12px] text-slate-400 dark:text-neutral-500">
                Draft auto-saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-neutral-400">
            <span>Powered by</span>
            <span className="font-semibold text-slate-700 dark:text-neutral-200">
              Resend
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center p-8 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <FiCheck size={32} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  Message Sent!
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Thanks for reaching out! Your message was delivered via
                  Resend. I will get back to you as soon as possible.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStatus('idle')}
                    className="rounded-lg bg-neutral-200 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Send Another
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
                  >
                    Close Mail
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex h-full flex-col">
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="botField"
                  value={form.botField}
                  onChange={(e) =>
                    setForm({ ...form, botField: e.target.value })
                  }
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                {/* Error Banner */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-4 mt-3 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    <FiAlertCircle size={15} className="mt-0.5 shrink-0" />
                    <div className="flex-1">{errorMessage}</div>
                  </motion.div>
                )}

                {/* Header Fields (macOS Mail style) */}
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {/* To Field (Read-only Chip) */}
                  <div className="flex items-center px-4 py-2">
                    <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-neutral-500">
                      To:
                    </span>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      <span>Abdul Kader</span>
                      <span className="text-[11px] opacity-70">
                        &lt;contact@abdulkader.me&gt;
                      </span>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="flex items-center px-4 py-1.5">
                    <label
                      htmlFor="contact-name"
                      className="flex w-16 shrink-0 items-center gap-1 text-xs font-medium text-slate-400 dark:text-neutral-500"
                    >
                      <FiUser size={12} /> Name:
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex items-center px-4 py-1.5">
                    <label
                      htmlFor="contact-email"
                      className="flex w-16 shrink-0 items-center gap-1 text-xs font-medium text-slate-400 dark:text-neutral-500"
                    >
                      <FiMail size={12} /> Email:
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="flex items-center px-4 py-1.5">
                    <label
                      htmlFor="contact-subject"
                      className="flex w-16 shrink-0 items-center gap-1 text-xs font-medium text-slate-400 dark:text-neutral-500"
                    >
                      <FiMessageSquare size={12} /> Subject:
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      placeholder="Project Inquiry / Job Opportunity / Greeting"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {/* Body Textarea */}
                <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
                  <textarea
                    required
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                    className="h-full min-h-[160px] w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                  />
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppWindow>
  );
}

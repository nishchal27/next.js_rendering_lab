"use client";

/*
  RenderingPipeline.tsx

  This pipeline is a client component because it animates over time.

  Important: this animation is only a teaching visualization. It does not control
  how Next.js renders the route. The real rendering behavior comes from the page
  files in /app/csr, /app/ssr, /app/ssg, and /app/isr.
*/
import { useEffect, useState } from "react";
import type { PipelineStep } from "@/lib/rendering-modes";

type RenderingPipelineProps = {
  steps: PipelineStep[];
  accentClass: string;
  softClass: string;
};

const STEP_MS = 1600;

/*
  Animates through the configured rendering steps for the active route.

  The steps come from rendering-modes.ts so this component can focus on showing
  sequence and responsibility rather than knowing SSR/SSG/ISR details itself.
*/
export function RenderingPipeline({ steps, accentClass, softClass }: RenderingPipelineProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Move through the conceptual workflow so viewers can see the order of work.
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="mt-5">
      <div className="relative">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => {
            // Done/active/waiting states make the pipeline read like a real request trace.
            const isActive = index === activeStep;
            const isDone = index < activeStep;

            return (
              <div key={`${step.actor}-${step.title}`} className="relative">
                <div
                  className={`flex min-h-64 flex-col rounded-lg border p-4 transition-all duration-500 ${
                    isActive
                      ? "border-slate-900 bg-white shadow-soft ring-2 ring-slate-900/5"
                      : isDone
                        ? "border-slate-300 bg-white"
                        : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white ${
                        isActive || isDone ? accentClass : "bg-slate-300"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? softClass : "bg-slate-100 text-slate-500"}`}>
                      {step.actor}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-black leading-6 text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>

                  <div className="mt-auto pt-4">
                    <div className="rounded-md border border-slate-200 bg-slate-950 px-3 py-2 font-mono text-xs leading-5 text-white">
                      <span className={isActive ? "text-emerald-300" : isDone ? "text-sky-300" : "text-slate-400"}>
                        {isActive ? "RUNNING" : isDone ? "DONE" : "WAITING"}
                      </span>
                      <span className="text-slate-400"> / </span>
                      {step.network}
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(100%+0.25rem)] top-1/2 z-10 hidden h-1 w-8 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200 xl:block">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${accentClass} transition-all duration-700 ${
                        index < activeStep ? "w-full" : index === activeStep ? "w-2/3 animate-pulse" : "w-0"
                      }`}
                    />
                    {index === activeStep && (
                      <div className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${accentClass} animate-pipeline`} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Now happening</p>
        <p className="mt-2 text-sm font-semibold text-slate-950">
          {steps[activeStep].actor}: {steps[activeStep].detail}
        </p>
      </div>
    </div>
  );
}

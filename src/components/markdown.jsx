import React from 'react';
import remarkGfm from 'remark-gfm';

const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

// GitHub-Flavored Markdown: tables, strikethrough, task lists, autolinks
export const remarkPlugins = [remarkGfm];

// Consistent rendering for AI answers across the app
export const mdComponents = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
  table: ({ node, ...props }) => (
    <div className="my-5 overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.01]">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-white/[0.04]" {...props} />,
  th: ({ node, ...props }) => (
    <th
      className={`${MONO} whitespace-nowrap border-b border-white/[0.08] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-300/90`}
      {...props}
    />
  ),
  tr: ({ node, ...props }) => (
    <tr
      className="border-b border-white/[0.05] transition-colors last:border-0 even:bg-white/[0.015] hover:bg-white/[0.03]"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="px-4 py-3 align-top leading-relaxed text-neutral-300 first:font-medium first:text-neutral-100"
      {...props}
    />
  ),
};
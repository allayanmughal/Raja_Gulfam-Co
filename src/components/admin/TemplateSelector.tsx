import React from 'react';
import type { EventTemplateType, TemplateDefinition } from '../../types/event';
import { Layout, Check } from 'lucide-react';
interface Props {
  selectedTemplate: EventTemplateType;
  onChange: (template: EventTemplateType) => void;
}

const templates: TemplateDefinition[] = [
  {
    id: 'template1',
    name: 'Template 1 — Large Feature',
    subtitle: 'Full-Width Hero Image',
    description: 'Prominent full-width image header, red priority detail badge, date pill, and spacious premium layout.'
  },
  {
    id: 'template2',
    name: 'Template 2 — Split Layout',
    subtitle: 'Side-by-Side 50/50 Grid',
    description: 'Horizontal split with image on left/right, text panel on opposite side, red alert line, and metadata.'
  },
  {
    id: 'template3',
    name: 'Template 3 — Magazine',
    subtitle: 'Editorial Newspaper Design',
    description: 'Editorial header bar, top banner image, bold headline, red priority tag line, and drop-cap style text.'
  },
  {
    id: 'template4',
    name: 'Template 4 — Minimal',
    subtitle: 'Whitespace & Compact Thumbnail',
    description: 'Clean whitespace-heavy layout with compact square thumbnail, red priority accent bar, and date badge.'
  },
  {
    id: 'template5',
    name: 'Template 5 — Image Overlay',
    subtitle: 'Dark Gradient Hero Backdrop',
    description: 'Full cover background image with dark gradient, headline over image, glowing red priority badge.'
  },
  {
    id: 'template6',
    name: 'Template 6 — Asymmetric',
    subtitle: 'Creative Offset Layout',
    description: 'Staggered asymmetric arrangement with gold border highlight, red callout box, and date tag.'
  }
];

export const TemplateSelector: React.FC<Props> = ({ selectedTemplate, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layout className="w-4 h-4 text-blue-500" />
          <span>Card Design Template Selection</span>
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Selected: <strong className="text-blue-600 dark:text-blue-400">{templates.find(t => t.id === selectedTemplate)?.name}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onChange(tmpl.id)}
              className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-300 border-2 flex flex-col justify-between ${isSelected
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              {/* Checkmark Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Mini Visual Preview Wireframe */}
              <div className="mb-3 space-y-2">
                <div className="h-20 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-2 overflow-hidden flex flex-col justify-between relative">

                  {/* Template 1 Mini */}
                  {tmpl.id === 'template1' && (
                    <div className="space-y-1.5 h-full flex flex-col">
                      <div className="h-10 w-full bg-blue-500/30 rounded-lg flex items-center justify-center text-[9px] text-blue-400 font-bold">
                        Hero Image
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-12 bg-rose-500 rounded" />
                        <div className="h-1.5 w-20 bg-slate-400 dark:bg-slate-600 rounded" />
                      </div>
                    </div>
                  )}

                  {/* Template 2 Mini */}
                  {tmpl.id === 'template2' && (
                    <div className="grid grid-cols-12 gap-1.5 h-full">
                      <div className="col-span-5 bg-blue-500/30 rounded-lg flex items-center justify-center text-[8px] text-blue-400 font-bold">
                        Img
                      </div>
                      <div className="col-span-7 space-y-1 py-1">
                        <div className="h-1.5 w-10 bg-rose-500 rounded" />
                        <div className="h-2 w-full bg-slate-400 dark:bg-slate-600 rounded" />
                        <div className="h-1.5 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" />
                      </div>
                    </div>
                  )}

                  {/* Template 3 Mini */}
                  {tmpl.id === 'template3' && (
                    <div className="space-y-1 h-full flex flex-col">
                      <div className="h-2.5 w-full bg-slate-300 dark:bg-slate-700 rounded flex items-center px-1 text-[7px] text-slate-500">
                        NEWS BULLETIN
                      </div>
                      <div className="h-7 w-full bg-blue-500/30 rounded flex items-center justify-center text-[8px] text-blue-400 font-bold">
                        Image
                      </div>
                      <div className="h-1.5 w-14 bg-rose-500 rounded" />
                    </div>
                  )}

                  {/* Template 4 Mini */}
                  {tmpl.id === 'template4' && (
                    <div className="space-y-1.5 h-full py-1">
                      <div className="flex items-center justify-between">
                        <div className="h-1.5 w-10 bg-slate-300 dark:bg-slate-700 rounded" />
                        <div className="h-4 w-4 bg-blue-500/30 rounded" />
                      </div>
                      <div className="h-1.5 w-14 bg-rose-500 rounded" />
                      <div className="h-2 w-full bg-slate-400 dark:bg-slate-600 rounded" />
                    </div>
                  )}

                  {/* Template 5 Mini */}
                  {tmpl.id === 'template5' && (
                    <div className="h-full w-full rounded bg-gradient-to-t from-slate-950 via-slate-900 to-blue-900/40 p-1.5 flex flex-col justify-end">
                      <div className="h-1.5 w-10 bg-rose-500 rounded mb-1" />
                      <div className="h-2 w-full bg-white rounded" />
                    </div>
                  )}

                  {/* Template 6 Mini */}
                  {tmpl.id === 'template6' && (
                    <div className="h-full w-full border-l-2 border-l-amber-500 pl-1.5 space-y-1 py-1">
                      <div className="h-6 w-full bg-blue-500/30 rounded flex items-center justify-center text-[8px] text-amber-400 font-bold">
                        Offset Img
                      </div>
                      <div className="h-1.5 w-12 bg-rose-500 rounded" />
                    </div>
                  )}

                </div>

                <div className="space-y-0.5">
                  <h4 className="font-heading text-xs font-bold text-slate-900 dark:text-white">
                    {tmpl.name}
                  </h4>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {tmpl.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {tmpl.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

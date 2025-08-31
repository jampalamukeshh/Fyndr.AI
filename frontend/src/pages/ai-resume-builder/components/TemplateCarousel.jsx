import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const TemplateCarousel = ({ selectedTemplate, onTemplateChange, templates: templateIds = ['modern', 'classic'] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allTemplates = [
    { id: 'modern', name: 'Modern Professional', preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=400&fit=crop', description: 'Clean, contemporary design perfect for tech and creative roles', features: ['ATS-friendly', 'Modern layout', 'Color accents'] },
    { id: 'classic', name: 'Classic Executive', preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop', description: 'Traditional format ideal for corporate and executive positions', features: ['Conservative design', 'Professional', 'Time-tested'] },
    { id: 'minimal', name: 'Minimal Clean', preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop', description: 'Minimalist approach focusing on content clarity', features: ['Clean lines', 'Content-focused', 'Easy to read'] },
    { id: 'technical', name: 'Technical Pro', preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop', description: 'Structured format perfect for technical roles', features: ['Structured', 'Skills emphasis'] },
    { id: 'elegant', name: 'Elegant Serif', preview: 'https://images.unsplash.com/photo-1529336953121-4c2eda06a831?w=300&h=400&fit=crop', description: 'Refined serif headings with classic accents', features: ['Serif headings', 'Subtle borders'] },
    { id: 'compact', name: 'Compact One-Page', preview: 'https://images.unsplash.com/photo-1529672472568-9f3aa1a71f6a?w=300&h=400&fit=crop', description: 'Space-efficient layout to fit more on one page', features: ['Dense layout', 'Condensed spacing'] },
  ];

  const uniqIds = Array.from(new Set(templateIds || []));
  const templates = allTemplates.filter(t => uniqIds.includes(t.id));

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [templates.length]);

  const scrollByAmount = (dir = 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.floor(el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 200);
  };

  const selectTemplate = (template) => onTemplateChange(template.id);

  return (
    <div className="bg-card border border-border rounded-card p-6 mb-6 shadow relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">Choose Template</h3>
        <div className="text-xs text-muted-foreground">{templates.length} available</div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <Button className="pointer-events-auto shadow-md" aria-label="Scroll left" variant="ghost" size="icon" onClick={() => scrollByAmount(-1)} disabled={!canScrollLeft}>
            <Icon name="ChevronLeft" size={20} />
          </Button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <Button className="pointer-events-auto shadow-md" aria-label="Scroll right" variant="ghost" size="icon" onClick={() => scrollByAmount(1)} disabled={!canScrollRight}>
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent px-8"
          role="list"
          aria-label="Resume templates"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByAmount(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); scrollByAmount(1); }
          }}
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 min-w-[220px] md:min-w-[260px] lg:min-w-[280px] snap-start transition-all duration-300 ${selectedTemplate === template.id ? 'border-primary shadow-elevation-2' : 'border-border hover:border-primary/50'}`}
              role="listitem"
              onClick={() => selectTemplate(template)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectTemplate(template);
                }
              }}
              tabIndex={0}
              aria-selected={selectedTemplate === template.id}
              aria-label={`${template.name} template`}
            >
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img src={template.preview} alt={template.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-medium text-foreground text-sm">{template.name}</h4>
                  {selectedTemplate === template.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} color="white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <span key={feature} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">{feature}</span>
                  ))}
                </div>
              </div>

              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={14} color="white" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateCarousel;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Image from 'components/AppImage';

const TestimonialsCarousel = ({ content }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const testimonials = content?.entries || [];

  useEffect(() => {
    if (!isAutoPlaying || !testimonials.length) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'job-seeker': return 'from-primary to-primary/80';
      case 'recruiter': return 'from-accent to-accent/80';
      case 'employer': return 'from-success to-success/80';
      default: return 'from-primary to-primary/80';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job-seeker': return 'User';
      case 'recruiter': return 'Search';
      case 'employer': return 'Building';
      default: return 'User';
    }
  };

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  if (!currentTestimonial) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-heading-bold text-foreground mb-4 tracking-wide">
            {content?.heading || 'Success Stories'}
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
            {content?.subheading}
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="glassmorphic rounded-[1.25rem] border border-border/80 p-8 sm:p-12 elevation-3"
            >
              {/* Testimonial Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                      <Image
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${getTypeColor(currentTestimonial.type)} rounded-full flex items-center justify-center`}>
                      <Icon name={getTypeIcon(currentTestimonial.type)} size={12} color="white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-heading-semibold text-foreground tracking-wide">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {currentTestimonial.role} at {currentTestimonial.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground font-caption">
                    {currentTestimonial.outcome}
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-lg text-foreground font-body leading-relaxed mb-8 italic">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentTestimonial.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-body font-body-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Icon name="Quote" size={48} className="text-primary" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              iconName="ChevronLeft"
              iconSize={20}
            />

            {/* Dots Indicator */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full spring-transition ${index === currentIndex
                      ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              iconName="ChevronRight"
              iconSize={20}
            />
          </div>

          {/* Auto-play Toggle */}
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground spring-transition"
            >
              <Icon name={isAutoPlaying ? "Pause" : "Play"} size={14} />
              <span>{isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll</span>
            </button>
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          {(content?.stats || []).map((stat) => (
            <div key={stat.label} className="rounded-[1rem] border border-border/70 bg-card/50 p-5">
              <div className={`text-3xl font-heading font-heading-bold mb-2 ${stat.tone || 'text-primary'}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-caption">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-primary/20 rounded-full particle-float"></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-accent/30 rounded-full particle-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-success/25 rounded-full particle-float" style={{ animationDelay: '5s' }}></div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;

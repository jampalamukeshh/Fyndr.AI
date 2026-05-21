import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const FeaturesSection = ({ content }) => {
  const navigate = useNavigate();
  const features = content?.cards || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-card/50 to-background">
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
            {content?.heading || 'Powerful Features'}
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-3xl mx-auto">
            {content?.subheading}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              role={feature.path ? 'button' : undefined}
              tabIndex={feature.path ? 0 : undefined}
              className={`glassmorphic rounded-[1.25rem] border border-border/80 p-6 elevation-2 hover:elevation-3 spring-transition group stagger-${index + 1} ${feature.path ? 'cursor-pointer' : ''}`}
              onClick={() => feature.path && navigate(feature.path)}
              onKeyDown={(event) => {
                if (!feature.path) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(feature.path);
                }
              }}
            >
              {/* Feature Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-[1.25rem] flex items-center justify-center glow-primary group-hover:scale-110 spring-transition`}>
                  <Icon name={feature.icon} size={20} color="white" />
                </div>
                <div className="text-xs text-muted-foreground font-data">
                  {feature.stats}
                </div>
              </div>

              {/* Feature Content */}
              <div>
                <h3 className="text-lg font-heading font-heading-semibold text-foreground mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {feature.path && (
                <div className="mt-4 pt-4 border-t border-border/50 text-xs text-primary font-body font-body-medium">
                  Open feature
                </div>
              )}

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-[1.25rem] opacity-0 group-hover:opacity-100 spring-transition pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 glassmorphic rounded-[1.25rem] border border-border/80 p-8 elevation-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {(content?.platformStats || []).map((stat) => (
              <div key={stat.label} className="rounded-[1rem] border border-border/70 bg-card/60 p-4">
                <div className={`text-2xl font-heading font-heading-bold mb-2 ${stat.tone || 'text-primary'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/5 w-1 h-1 bg-primary/20 rounded-full particle-float"></div>
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-accent/30 rounded-full particle-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-success/25 rounded-full particle-float" style={{ animationDelay: '6s' }}></div>
      </div>
    </section>
  );
};

export default FeaturesSection;

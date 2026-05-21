import React from "react";
import MainLayout from "components/layout/MainLayout";
import Icon from "components/AppIcon";

const PremiumAppShell = ({
  title,
  subtitle,
  badge = "Premium",
  icon = "Gem",
  children,
  titleClassName = "",
  contentClassName = "",
  hideFloatingChat = false,
  noPadding = false,
  fullWidth = true,
}) => {
  return (
    <MainLayout noPadding={noPadding} fullWidth={fullWidth} hideFloatingChat={hideFloatingChat}>
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden px-6 pb-8 pt-10 md:px-10 lg:px-16">
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <div className="absolute -top-16 -left-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-10 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="rounded-3xl border border-border/80 bg-card/80 p-8 shadow-2xl backdrop-blur-xl md:p-12">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <Icon name={icon} size={14} /> {badge}
              </p>
              <h1 className={`font-heading mt-5 text-3xl md:text-5xl ${titleClassName}`.trim()}>{title}</h1>
              {subtitle ? (
                <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className={`px-6 pb-16 md:px-10 lg:px-16 ${contentClassName}`.trim()}>{children}</section>
      </main>
    </MainLayout>
  );
};

export default PremiumAppShell;

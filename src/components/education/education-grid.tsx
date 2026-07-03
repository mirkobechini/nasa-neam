"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Resource {
  title: string;
  desc: string;
  icon: string;
  color: string;
  tag: string;
  url: string;
}

const resources: Resource[] = [
  {
    title: "What Are Near-Earth Asteroids?",
    desc: "Discover the origins and characteristics of NEOs and why scientists track them.",
    icon: "🔍",
    color: "#4fc3f7",
    tag: "Beginner",
    url: "https://science.nasa.gov/asteroids/",
  },
  {
    title: "The Impact That Changed Earth",
    desc: "Learn about the Chicxulub event and how asteroid impacts shaped our planet.",
    icon: "🌋",
    color: "#ff5252",
    tag: "Intermediate",
    url: "https://www.nasa.gov/asteroid-and-comet-impact-hazards/",
  },
  {
    title: "Planetary Defense Strategies",
    desc: "How NASA and global agencies plan to protect Earth from asteroid threats.",
    icon: "🛡",
    color: "#69f0ae",
    tag: "Advanced",
    url: "https://www.nasa.gov/planetarydefense/",
  },
  {
    title: "Mining the Stars",
    desc: "The future of asteroid mining — resources, technology, and economic potential.",
    icon: "🏭",
    color: "#ffab40",
    tag: "Research",
    url: "https://www.jpl.nasa.gov/asteroid-watch/",
  },
  {
    title: "Observing Asteroids at Home",
    desc: "A beginner's guide to spotting asteroids with telescopes and online tools.",
    icon: "🔭",
    color: "#b388ff",
    tag: "Beginner",
    url: "https://www.planetary.org/",
  },
  {
    title: "The Torino Scale Explained",
    desc: "Understand the scale that classifies the impact hazard of near-Earth objects.",
    icon: "⚖",
    color: "#ff4081",
    tag: "Reference",
    url: "https://cneos.jpl.nasa.gov/sentry/torino_scale.html",
  },
  {
    title: "NASA Jet Propulsion Laboratory",
    desc: "Explore the latest asteroid discoveries and orbital data from JPL.",
    icon: "🛰",
    color: "#00e5ff",
    tag: "Research",
    url: "https://www.jpl.nasa.gov/",
  },
  {
    title: "ESA Space Safety Programme",
    desc: "European Space Agency's initiatives for planetary defense and asteroid detection.",
    icon: "🛸",
    color: "#448aff",
    tag: "Advanced",
    url: "https://www.esa.int/Space_Safety/",
  },
  {
    title: "CNSA Deep Space Exploration",
    desc: "China's asteroid exploration missions and near-Earth object monitoring.",
    icon: "🚀",
    color: "#ff6d00",
    tag: "Research",
    url: "https://www.cnsa.gov.cn/",
  },
];

interface EducationalCardProps {
  resource: Resource;
  onClick: (url: string) => void;
}

function EducationalCard({ resource, onClick }: EducationalCardProps) {
  return (
    <Card
      className="cursor-pointer hover:translate-y-[-4px] transition-all"
      onClick={() => onClick(resource.url)}
    >
      <CardContent className="p-0">
        <div
          className="h-36 flex items-center justify-center text-4xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${resource.color}22, transparent)`,
          }}
        >
          <span style={{ textShadow: `0 0 30px ${resource.color}44` }}>
            {resource.icon}
          </span>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-card)]" />
        </div>
        <div className="p-5">
          <h4 className="text-sm font-semibold mb-1">{resource.title}</h4>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            {resource.desc}
          </p>
          <Badge
            variant="outline"
            className="mt-3 text-[0.6rem] font-semibold border-primary/20 text-primary bg-primary/5"
          >
            {resource.tag}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface EducationGridProps {
  loading: boolean;
  onOpenResource: (url: string) => void;
}

export function EducationGrid({ loading, onOpenResource }: EducationGridProps) {
  const t = useTranslations("education");

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <div className="h-36">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            <div className="p-5 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-5 w-16 mt-3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">{t("noResources")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {resources.map((r) => (
        <EducationalCard key={r.title} resource={r} onClick={onOpenResource} />
      ))}
    </div>
  );
}

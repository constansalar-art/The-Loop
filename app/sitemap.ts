import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { AREA_ORDER, AREAS } from "@/data/areas";
import { CAREERS } from "@/data/carreras";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/test`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/carreras`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const areaRoutes: MetadataRoute.Sitemap = AREA_ORDER.map((code) => ({
    url: `${base}/resultado/${AREAS[code].slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const careerRoutes: MetadataRoute.Sitemap = CAREERS.map((c) => ({
    url: `${base}/carreras/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...areaRoutes, ...careerRoutes];
}

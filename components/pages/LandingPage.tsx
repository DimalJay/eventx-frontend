"use client";

import { useAuth } from "../auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "@/service/eventService";
import { IEvent } from "@/types";
import Hero from "../landing/Hero";
import LogoWall from "../landing/LogoWall";
import Marquee from "../landing/Marquee";
import FeatureBento from "../landing/FeatureBento";
import UpcomingEvents from "../landing/UpcomingEvents";
import Testimonials from "../landing/Testimonials";
import CTABand from "../landing/CTABand";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const { data: rawEvents = [], isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      try {
        const response = await getPublicEvents();
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch public events", error);
        return [];
      }
    },
  });

  const upcomingEvents = rawEvents
    .filter((e: IEvent) => e.startDate && new Date(e.startDate) > new Date())
    .sort(
      (a: IEvent, b: IEvent) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 3);

  return (
    <main className="min-h-dvh">
      <Hero isAuthenticated={isAuthenticated} featuredEvent={upcomingEvents[0]} />
      <LogoWall />
      <Marquee />
      <FeatureBento />
      <UpcomingEvents events={upcomingEvents} isLoading={isLoading} />
      <Testimonials />
      <CTABand />
    </main>
  );
}
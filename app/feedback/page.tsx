"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, MessageSquareCode, CheckCircle, Award, Users } from "lucide-react";
import { toast } from "sonner";
import { completeFeedback } from "@/service/feedbackService";

function FeedbackForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = searchParams.get("eventId") || "";
  const participantId = searchParams.get("participantId") || "";
  const initialRating = parseInt(searchParams.get("rating") || "0", 10);
  const token = searchParams.get("token") || "";

  const [orgRating, setOrgRating] = useState(0);
  const [contentRating, setContentRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId || !participantId || !token) {
      toast.error("Invalid feedback link.");
    }
  }, [eventId, participantId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !participantId || !token) {
      toast.error("Missing required feedback details.");
      return;
    }
    if (orgRating === 0 || contentRating === 0) {
      toast.error("Please provide ratings for both questions.");
      return;
    }

    setLoading(true);
    try {
      const res = await completeFeedback({
        eventId,
        participantId,
        organizationRating: orgRating,
        contentRating: contentRating,
        experienceRating: initialRating > 0 ? initialRating : undefined,
        comment,
        token,
      });

      if (res.success) {
        setIsSubmitted(true);
        toast.success("Feedback submitted successfully!");
      } else {
        toast.error(res.message || "Failed to submit feedback.");
      }
    } catch {
      toast.error("An error occurred while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-soft text-success mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2 font-display">Thank You!</h2>
        <p className="text-muted-subtle mb-6 max-w-md mx-auto">
          Your feedback has been submitted successfully. We appreciate your time and comments to help us improve future events!
        </p>
        <button
          onClick={() => router.push(`/event/${eventId}`)}
          className="btn"
        >
          View Event
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg p-8 rounded-card border border-border bg-surface shadow-card">
      <div className="text-center mb-6">
        <span className="eyebrow block mb-2">Feedback</span>
        <h2 className="text-2xl font-extrabold text-foreground font-display">Complete Your Feedback</h2>
        <p className="text-sm text-muted-subtle mt-1">
          {initialRating > 0
            ? `You rated your overall experience ${initialRating} ${initialRating === 1 ? "star" : "stars"} in the email. Answer two quick questions to finish.`
            : "Rate your experience and share a few details below."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Rating */}
        <div className="bg-surface-muted p-5 rounded-card border border-border">
          <label className="flex items-center gap-2 text-sm font-bold text-muted mb-3">
            <Users className="w-4 h-4 text-primary" />
            1. How organized was the event setup and logistics?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOrgRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= orgRating ? "fill-amber-400 text-amber-400" : "text-muted-subtle"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Rating */}
        <div className="bg-surface-muted p-5 rounded-card border border-border">
          <label className="flex items-center gap-2 text-sm font-bold text-muted mb-3">
            <Award className="w-4 h-4 text-primary" />
            2. How valuable was the content and sessions of the event?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setContentRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= contentRating ? "fill-amber-400 text-amber-400" : "text-muted-subtle"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Written Comment */}
        <div className="bg-surface-muted p-5 rounded-card border border-border">
          <label className="flex items-center gap-2 text-sm font-bold text-muted mb-2">
            <MessageSquareCode className="w-4 h-4 text-primary" />
            3. Share more details about your experience (Optional)
          </label>
          <textarea
            placeholder="Tell us what you liked or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-24 mt-2 p-3 text-sm rounded-input border border-border bg-surface outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring transition resize-none text-foreground placeholder:text-muted-subtle"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !eventId}
          className="btn w-full disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-muted p-4">
      <Suspense fallback={
        <div className="text-center p-8 rounded-card border border-border bg-surface shadow-card">
          <p className="text-sm font-semibold text-muted-subtle">Loading Feedback Form...</p>
        </div>
      }>
        <FeedbackForm />
      </Suspense>
    </main>
  );
}
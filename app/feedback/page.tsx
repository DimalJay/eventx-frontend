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
        comment,
        token,
      });

      if (res.success) {
        setIsSubmitted(true);
        toast.success("Feedback submitted successfully!");
      } else {
        toast.error(res.message || "Failed to submit feedback.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Thank You!</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Your feedback has been submitted successfully. We appreciate your time and comments to help us improve future events!
        </p>
        <button
          onClick={() => router.push(`/event/${eventId}`)}
          className="px-6 py-3 bg-black hover:bg-slate-900 text-white rounded-xl font-semibold uppercase tracking-widest text-xs transition"
        >
          View Event
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg p-8 rounded-3xl border border-white/50 bg-white/80 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Complete Your Feedback</h2>
        <p className="text-sm text-slate-600 mt-1">
          Thank you! Your {initialRating}-star rating for Overall Experience has been recorded.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Rating */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Users className="w-4 h-4 text-blue-500" />
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
                    star <= orgRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Rating */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Award className="w-4 h-4 text-blue-500" />
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
                    star <= contentRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Written Comment */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <MessageSquareCode className="w-4 h-4 text-blue-500" />
            3. Share more details about your experience (Optional)
          </label>
          <textarea
            placeholder="Tell us what you liked or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-24 mt-2 p-3 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-slate-400 transition resize-none text-slate-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !eventId}
          className="w-full h-12 flex items-center justify-center rounded-2xl bg-black hover:bg-slate-900 text-white font-semibold uppercase tracking-widest text-xs transition disabled:opacity-40"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 via-sky-50 to-indigo-50 p-4">
      <Suspense fallback={
        <div className="text-center p-8 bg-white/80 rounded-3xl border border-white/50 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-semibold text-slate-600">Loading Feedback Form...</p>
        </div>
      }>
        <FeedbackForm />
      </Suspense>
    </main>
  );
}

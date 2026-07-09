"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { request } from "@/lib/request";

const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    subject: z.string().min(3, { message: "Subject is required." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactUsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            await request("/contact", {
                method: "POST",
                data: {
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                }
            });

            toast.success("Your message has been sent successfully!");
            reset(); 
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
            {/* Main Wrapper */}
            <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
                
                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                            EventX
                        </p>
                        <p className="text-lg font-semibold tracking-wide text-black">
                            Get in Touch
                        </p>
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
                    
                    {/* Left Section: Contact Form */}
                    <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-8 h-full flex flex-col">
                        <div className="flex flex-col gap-3 mb-8">
                            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                                Contact Us
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
                                We'd love to hear from you
                            </h1>
                            <p className="text-sm leading-6 text-black/70">
                                Have a question about our events, pricing, or anything else? Our team is ready to answer all your questions.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-black/80">Your Name</label>
                                    <input
                                        autoComplete="off"
                                        id="name"
                                        {...register("name")}
                                        className={`w-full px-4 py-3 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-black/10'} bg-white text-sm text-black outline-none transition focus:border-black/30`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                </div>
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-black/80">Email Address</label>
                                    <input
                                        autoComplete="off"
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        className={`w-full px-4 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-black/10'} bg-white text-sm text-black git  outline-none transition focus:border-black/30`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                </div>
                            </div>
                            
                            {/* Subject Input */}
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-black/80">Subject</label>
                                <input
                                    id="subject"
                                    {...register("subject")}
                                    className={`w-full px-4 py-3 rounded-2xl border ${errors.subject ? 'border-red-500' : 'border-black/10'} bg-white text-sm text-black outline-none transition focus:border-black/30`}
                                    placeholder="How can we help you?"
                                />
                                {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-black/80">Message</label>
                                <textarea
                                    id="message"
                                    {...register("message")}
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-2xl border ${errors.message ? 'border-red-500' : 'border-black/10'} bg-white text-sm text-black outline-none transition focus:border-black/30 resize-none`}
                                    placeholder="Write your message here..."
                                />
                                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 mt-auto rounded-full bg-black text-white text-sm font-semibold uppercase tracking-widest transition hover:bg-black/90 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Send size={16} className={isSubmitting ? "animate-pulse" : ""} />
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </section>

                    {/* Right Section: Contact Info & Support */}
                    <section className="flex flex-col gap-4 h-full">
                        <div className="rounded-3xl border border-black/10 bg-black px-6 py-8 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                Reach Out Directly
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                Contact Information
                            </p>
                            <p className="mt-3 text-sm text-white/70">
                                Prefer to reach us directly? Use the information below to get in touch with our support team.
                            </p>
                        </div>

                        <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md p-6 shadow-sm">
                            <div className="flex items-start gap-4 border-b border-black/10 pb-4">
                                <div className="p-3 bg-black/5 rounded-full text-black">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-black">Email Us</h2>
                                    <p className="mt-1 text-sm text-black/60">support@eventx.com</p>
                                    <p className="text-sm text-black/60">info@eventx.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 border-b border-black/10 pb-4 pt-2">
                                <div className="p-3 bg-black/5 rounded-full text-black">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-black">Call Us</h2>
                                    <p className="mt-1 text-sm text-black/60">+1 (555) 123-4567</p>
                                    <p className="text-sm text-black/60">Mon-Fri, 9am-6pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 pt-2">
                                <div className="p-3 bg-black/5 rounded-full text-black">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-black">Visit Us</h2>
                                    <p className="mt-1 text-sm text-black/60">123 EventX Street,</p>
                                    <p className="text-sm text-black/60">Tech City, TC 10010</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md p-6 shadow-sm mt-auto">
                            <div className="flex items-start gap-3 mb-4">
                                <MessageSquare size={20} className="text-black flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 mb-2">
                                        Looking for quick answers?
                                    </p>
                                    <p className="text-sm text-black/70">
                                        Check out our FAQ page. You might find the answer you're looking for right there.
                                    </p>
                                </div>
                            </div>
                            <Link href="/faq" className="flex items-center justify-center w-full h-12 rounded-full border border-black/20 text-black bg-white text-sm font-semibold uppercase tracking-widest transition hover:border-black/50 hover:bg-black/5">
                                Visit Help Center
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

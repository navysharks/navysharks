import { Mail, MessageSquare, MapPin, Phone, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to send message");
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    } catch (error: any) {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-xl text-slate-300">
              Have questions? We're here to help you navigate your luxury
              lifestyle journey
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 text-slate-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-slate-300"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2 text-slate-300"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register("subject")}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                    placeholder="Membership Inquiry"
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2 text-slate-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-slate-300 mb-8">
                  Reach out to us through any of these channels. Our concierge
                  team is available 24/7 for members.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-slate-400 text-sm mb-2">
                      For general inquiries
                    </p>
                    <a
                      href="mailto:support@navysharks.com"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      support@navysharks.com
                    </a>
                    <br />
                    <a
                      href="mailto:elite@navysharks.com"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      elite@navysharks.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-slate-400 text-sm mb-2">
                      Mon–Fri, 9am–5pm AEDT (Melbourne)
                    </p>
                    <a
                      href="tel:+15551234567"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <p className="text-slate-400 text-sm mb-2">
                      Direct messaging for members
                    </p>
                    <p className="text-cyan-400">Members-only access</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Headquarters</h3>
                    <p className="text-slate-400 text-sm">
                      Navy Sharks Concierge Club
                      <br />
                      Global Operations
                      <br />
                      Available in 4 Countries
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 p-6 rounded-xl">
                <h3 className="font-semibold mb-2 text-cyan-400">
                  Members Get Priority Support
                </h3>
                <p className="text-sm text-slate-300">
                  Elite members receive direct access to the founder and 24/7
                  concierge service via dedicated WhatsApp group.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  What's the response time for inquiries?
                </h3>
                <p className="text-slate-300">
                  We typically respond to all inquiries within 24 hours. Members
                  receive priority support with response times under 2 hours.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  How many days until you get the physical ID?
                </h3>
                <p className="text-slate-300">
                  Physical RFID cards are shipped within 3-5 business days. You can use your digital code immediately while waiting.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  Can I schedule a call before joining?
                </h3>
                <p className="text-slate-300">
                  Yes! Contact us to schedule a consultation call where we'll
                  answer your questions and help you choose the right membership
                  tier.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-slate-300">
                  Monthly VIP memberships can be canceled anytime. Annual plans
                  are non-refundable but you retain full access for the entire
                  year.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  How do I access the Elite WhatsApp group?
                </h3>
                <p className="text-slate-300">
                  Upon Elite membership confirmation, you'll receive an invite
                  link to join the exclusive WhatsApp group within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
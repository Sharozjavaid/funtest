import { cookies } from "next/headers";
import { getPosts } from "@/lib/firestore";
import { FeedList } from "@/components/feed/FeedList";
import Link from "next/link";

export const dynamic = "force-dynamic";

const IMAGES = {
  hero: "https://images.pexels.com/photos/20184431/pexels-photo-20184431.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  discover:
    "https://images.pexels.com/photos/4969859/pexels-photo-4969859.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  connect:
    "https://images.pexels.com/photos/4554292/pexels-photo-4554292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  share:
    "https://images.pexels.com/photos/2759564/pexels-photo-2759564.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  lifestyle:
    "https://images.pexels.com/photos/9329558/pexels-photo-9329558.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  gallery1:
    "https://images.pexels.com/photos/5326902/pexels-photo-5326902.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  gallery2:
    "https://images.pexels.com/photos/29134542/pexels-photo-29134542.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop",
  gallery3:
    "https://images.pexels.com/photos/4005096/pexels-photo-4005096.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  gallery4:
    "https://images.pexels.com/photos/16876005/pexels-photo-16876005.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop",
  gallery5:
    "https://images.pexels.com/photos/19138890/pexels-photo-19138890.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  gallery6:
    "https://images.pexels.com/photos/4504343/pexels-photo-4504343.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  cta: "https://images.pexels.com/photos/19860984/pexels-photo-19860984.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("barkboard-session");

  if (session?.value) {
    try {
      const { posts, nextCursor } = await getPosts({ limit: 20 });
      return (
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="font-heading font-bold text-2xl mb-4">
            The Dog Park
          </h1>
          <FeedList initialPosts={posts} initialCursor={nextCursor} />
        </div>
      );
    } catch {
      // Session invalid, fall through to landing page
    }
  }

  return (
    <>
      {/* ── Transparent Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-2xl text-white drop-shadow-md"
          >
            <img src="/mascot.png" alt="" className="h-9 w-auto rounded-xl drop-shadow-md" />
            BarkBoard
          </Link>
          <Link
            href="/login"
            className="bg-white/90 backdrop-blur-sm text-bark px-6 py-2.5 rounded-full text-sm font-heading font-semibold hover:bg-white transition-all shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.hero}
            alt="Person walking dog on a beautiful beach at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-up">
          <p className="text-white/80 font-body text-sm tracking-[0.3em] uppercase mb-4">
            The social network for dog people
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Where Every Walk
            <br />
            Tells a Story
          </h1>
          <p className="text-white/80 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover trails, connect with fellow dog lovers, and share the
            moments that make every walk worth remembering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-honey hover:bg-honey-dark text-white px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Join the Pack
            </Link>
            <a
              href="#discover"
              className="border-2 border-white/40 hover:border-white/80 text-white px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ── Social Proof Strip ── */}
      <section className="bg-stone py-6 border-y border-sand-dark/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "from-honey to-honey-dark",
                "from-paw-pink to-paw-pink-light",
                "from-leaf to-leaf-dark",
                "from-honey-dark to-honey",
                "from-paw-pink-light to-paw-pink",
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border-2 border-white`}
                />
              ))}
            </div>
            <span className="font-body text-bark/70 text-sm">
              12,000+ dog lovers
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-bark/10" />
          <div className="flex items-center gap-2">
            <span className="text-honey text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="font-body text-bark/70 text-sm">
              4.9 on the App Store
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-bark/10" />
          <span className="font-body text-bark/70 text-sm">
            Featured in{" "}
            <strong className="text-bark">TechCrunch</strong>
          </span>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="discover" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-honey font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-3">
              Why BarkBoard
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-bark mb-4">
              Built for the Modern
              <br />
              Dog Parent
            </h2>
            <p className="font-body text-bark-light text-lg max-w-2xl mx-auto">
              Whether you&apos;re exploring new neighborhoods or finding your
              pup&apos;s next best friend, BarkBoard makes every walk better.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: IMAGES.discover,
                alt: "Couple hiking with their dog near mountains",
                title: "Discover Routes",
                desc: "Find the best trails, parks, and walking paths near you. Curated by real dog walkers, rated by real pups.",
              },
              {
                img: IMAGES.connect,
                alt: "Stylish couple walking their dog together",
                title: "Find Your Pack",
                desc: "Connect with dog walkers in your neighborhood. Plan walks together. Build a community that moves.",
              },
              {
                img: IMAGES.share,
                alt: "Happy golden retriever enjoying autumn outdoors",
                title: "Share Moments",
                desc: "Capture and share every adventure. From sunrise strolls to muddy paw prints — every walk has a story.",
              },
            ].map((feature) => (
              <div key={feature.title} className="group">
                <div className="relative overflow-hidden rounded-3xl mb-6 aspect-[4/3]">
                  <img
                    src={feature.img}
                    alt={feature.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-bark mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-bark-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mascot Divider ── */}
      <section className="relative py-4 bg-stone overflow-hidden border-t border-sand-dark/20">
        <div className="animate-trot-across">
          <img
            src="/mascot.png"
            alt="BarkBoard mascot trotting along"
            className="h-14 w-auto rounded-xl animate-trot"
          />
        </div>
        {/* Dotted path line */}
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-honey/20 -translate-y-1/2" />
      </section>

      {/* ── Lifestyle Split ── */}
      <section className="py-24 bg-stone">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={IMAGES.lifestyle}
                  alt="Silhouette of person and dog against a vivid sunset"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-honey/10 rounded-full -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-paw-pink/10 rounded-full -z-10" />
            </div>
            <div>
              <p className="text-honey font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                More Than an App
              </p>
              <h2 className="font-heading text-4xl font-bold text-bark mb-6 leading-tight">
                A Community That
                <br />
                Gets Outdoors
              </h2>
              <p className="font-body text-bark-light text-lg leading-relaxed mb-8">
                BarkBoard isn&apos;t just another social app. It&apos;s for
                people who believe the best moments happen on the trail, at the
                park, and with your best friend by your side.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-honey/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-honey text-lg">{"\u2661"}</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-bark">
                      Wellness-First Design
                    </h4>
                    <p className="font-body text-bark-light text-sm">
                      Track walks, celebrate milestones, and stay motivated with
                      your community.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-leaf/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-leaf text-lg">{"\u25C6"}</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-bark">
                      Local Discovery
                    </h4>
                    <p className="font-body text-bark-light text-sm">
                      Real recommendations from real walkers. Not algorithms —
                      actual community wisdom.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-paw-pink/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-paw-pink text-lg">{"\u2726"}</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-bark">
                      Privacy Matters
                    </h4>
                    <p className="font-body text-bark-light text-sm">
                      Share as much or as little as you want. Your walks, your
                      rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Gallery ── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-honey font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-3">
              From the Community
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-bark">
              Every Walk Is Worth Sharing
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={IMAGES.gallery1}
                alt="Woman running with dog on beach at twilight"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-2xl row-span-2">
              <img
                src={IMAGES.gallery2}
                alt="Fluffy dog walking in a sunny park"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={IMAGES.gallery3}
                alt="Couple walking with dog in countryside"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={IMAGES.gallery4}
                alt="Beautiful golden retriever portrait"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-2xl aspect-[4/3] md:col-span-2">
              <img
                src={IMAGES.gallery5}
                alt="Dog walking on a boardwalk at the beach"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-bark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12K+", label: "Dog Lovers" },
              { value: "500+", label: "Walking Trails" },
              { value: "50+", label: "Cities" },
              { value: "2M+", label: "Walks Logged" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-4xl md:text-5xl font-bold text-honey mb-2">
                  {stat.value}
                </p>
                <p className="font-body text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.cta}
            alt="Couple walking dog on a scenic country road"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bark/80 to-bark/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Your Next Walk
            <br />
            Starts Here
          </h2>
          <p className="font-body text-white/70 text-lg max-w-xl mx-auto mb-10">
            Join thousands of dog lovers who&apos;ve turned their daily walks
            into something extraordinary.
          </p>
          <Link
            href="/login"
            className="inline-block bg-honey hover:bg-honey-dark text-white px-10 py-5 rounded-full font-heading font-semibold text-xl transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-bark py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <img
                src="/mascot.png"
                alt="BarkBoard mascot"
                className="h-12 w-auto rounded-xl opacity-80"
              />
              <div>
                <p className="font-heading font-bold text-2xl text-honey mb-1">
                  BarkBoard
                </p>
                <p className="font-body text-white/40 text-sm">
                  Where every walk tells a story.
                </p>
              </div>
            </div>
            <div className="flex gap-8">
              {["About", "Privacy", "Terms", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-body text-white/50 hover:text-white text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="font-body text-white/30 text-xs">
              &copy; 2026 BarkBoard. Made with love for pups everywhere.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

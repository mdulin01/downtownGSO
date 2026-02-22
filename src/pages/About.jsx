import { Heart, MapPin, Users, Sparkles, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="pt-16 pb-24 md:pb-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 px-4 py-16 border-b border-white/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Heart size={16} />
            Built by Locals
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            We Live Here.{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              We Care.
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            DowntownGSO is a passion project by two neighbors who believe downtown
            Greensboro is on the verge of something incredible — and want to help make it happen.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        {/* Story */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">Our Story</h2>
          <div className="text-slate-300 leading-relaxed space-y-4">
            <p>
              We're Mike and Adam — neighbors and downtown Greensboro residents who
              got tired of hearing people say "there's nothing to do downtown." We know that's
              not true. We walk these streets every day. We eat at the restaurants, grab coffee
              at the cafes, catch shows at the venues, and run into friends on Elm Street.
            </p>
            <p>
              Downtown GSO is already a great place. But we also see the potential for it to be
              even better — more walkable, more vibrant, more connected. A place where people
              don't just visit, but choose to live, work, and build their lives.
            </p>
            <p>
              So we built this platform. Not for profit. Not for clout. Just because we think
              the people who love downtown should have a place to connect, share what they know,
              and push for the changes they want to see.
            </p>
          </div>
        </section>

        {/* What This Is */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-white">What DowntownGSO Is</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <MapPin size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-bold">A Local Directory</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every restaurant, bar, shop, and venue in the downtown core — searchable,
                browsable, and on a map. No ads, no sponsored listings. Just the real deal.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Users size={20} className="text-pink-400" />
              </div>
              <h3 className="text-white font-bold">A Community Forum</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A place to share what you love about downtown, spotlight a hidden gem, flag
                an opportunity, or just talk about what's happening this weekend.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Sparkles size={20} className="text-amber-400" />
              </div>
              <h3 className="text-white font-bold">An Ideas Board</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Want better bike lanes? More public art? A dog park? Submit your idea, upvote
                others, and show decision-makers what the community actually wants.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Heart size={20} className="text-purple-400" />
              </div>
              <h3 className="text-white font-bold">A Labor of Love</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                No investors, no corporate backing. Just two people who love where they live
                and want to give back to the community that makes downtown special.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 pt-4">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-600/5 border border-emerald-500/20">
            <h2 className="text-2xl font-black text-white mb-3">Join Us</h2>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              Whether you live downtown, work downtown, or just love spending time here —
              this is your platform. Share something. Vote on an idea. Help us make this
              place even better.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/forum')}
                className="group flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition text-sm"
              >
                Visit the Forum
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/ideas')}
                className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold transition text-sm border border-white/10"
              >
                Share an Idea
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            Questions or feedback? Reach out at{' '}
            <a href="mailto:hello@downtowngso.org" className="text-emerald-400 hover:text-emerald-300 transition">
              hello@downtowngso.org
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

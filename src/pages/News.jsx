import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Newspaper size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Downtown News</h1>
            <p className="text-sm text-slate-400">Updates from downtown Greensboro</p>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No news articles yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition"
              >
                {article.imageUrl && (
                  <div className="aspect-[3/1] overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                      {article.category || 'News'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(article.publishedAt)}
                    </span>
                    {article.source && (
                      <span className="text-slate-500">via {article.source}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug">{article.title}</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">{article.summary}</p>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition mt-2"
                    >
                      Read full article <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

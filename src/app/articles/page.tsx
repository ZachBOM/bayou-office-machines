'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function excerpt(body: string, max = 120) {
  return body.length > max ? body.slice(0, max).trimEnd() + '…' : body;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(d => { setArticles(d.articles || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Page header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-2">From the Team</p>
          <h1 className="text-4xl font-extrabold text-[#f5f5f5] mb-3">News &amp; Articles</h1>
          <p className="text-[#9ca3af] text-lg max-w-xl">
            Tips, updates, and news from Bayou Office Machines.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <p className="text-[#4b5563] text-sm">Loading…</p>
          </div>
        ) : articles.length === 0 ? (
          /* Coming Soon state */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-[#1f1f1f] flex items-center justify-center mb-6">
              <Newspaper size={36} className="text-[#800000]" />
            </div>
            <h2 className="text-2xl font-bold text-[#f5f5f5] mb-3">Coming Soon</h2>
            <p className="text-[#9ca3af] text-sm max-w-sm leading-relaxed">
              We&apos;re working on articles with tips, product news, and updates from Bayou Office Machines. Check back soon.
            </p>
          </div>
        ) : (
          /* Article grid */
          <div className="space-y-6">
            {/* Featured first article */}
            <Link
              href={`/articles/${articles[0].id}`}
              className="group block bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 rounded-2xl overflow-hidden transition-colors"
            >
              {articles[0].image_url && (
                <div className="relative w-full h-72">
                  <Image
                    src={articles[0].image_url}
                    alt={articles[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-2">
                  {formatDate(articles[0].created_at)}
                </p>
                <h2 className="text-2xl font-bold text-[#f5f5f5] mb-3 group-hover:text-white transition-colors">
                  {articles[0].title}
                </h2>
                <p className="text-[#9ca3af] leading-relaxed mb-4">{excerpt(articles[0].body, 200)}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800000] group-hover:gap-3 transition-all">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Remaining articles in a 2-column grid */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.slice(1).map(article => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="group block bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 rounded-2xl overflow-hidden transition-colors"
                  >
                    {article.image_url && (
                      <div className="relative w-full h-44">
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1.5">
                        {formatDate(article.created_at)}
                      </p>
                      <h3 className="font-bold text-[#f5f5f5] mb-2 group-hover:text-white transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#9ca3af] leading-relaxed">{excerpt(article.body)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.article) setArticle(d.article);
        else router.push('/articles');
        setLoading(false);
      });
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-[#4b5563] text-sm">Loading…</p>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">

        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Articles
        </Link>

        {/* Date */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-3">
          {formatDate(article.created_at)}
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] mb-8 leading-tight">
          {article.title}
        </h1>

        {/* Main image */}
        {article.image_url && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-10">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Body */}
        <div className="prose prose-invert prose-lg max-w-none">
          {article.body.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="text-[#d1d5db] leading-relaxed mb-5">{para}</p>
            ) : (
              <div key={i} className="mb-2" />
            )
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#1f1f1f]">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#800000] hover:text-[#a00000] transition-colors"
          >
            <ArrowLeft size={14} /> All Articles
          </Link>
        </div>

      </div>
    </div>
  );
}

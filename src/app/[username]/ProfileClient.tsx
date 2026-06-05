"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/db/schema";

const DEFAULT_PROFILE_IMGS = [
  "https://images.pexels.com/photos/15502152/pexels-photo-15502152.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
  "https://images.pexels.com/photos/5193864/pexels-photo-5193864.png?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
  "https://images.pexels.com/photos/29282976/pexels-photo-29282976.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
  "https://images.pexels.com/photos/18041953/pexels-photo-18041953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
];

const DEFAULT_COVER_IMGS = [
  "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=900",
  "https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=900",
  "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=900",
];

// Default jumpscare video embed (classic scary face)
const DEFAULT_SCARE_VIDEO =
  "https://www.youtube.com/embed/6VmJirYnxGE?autoplay=1&controls=0&mute=0&start=0&rel=0";

// Fake locked post images (blurred)
const FAKE_POSTS = [
  "https://images.pexels.com/photos/15502152/pexels-photo-15502152.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=400&w=400",
  "https://images.pexels.com/photos/5193864/pexels-photo-5193864.png?auto=compress&cs=tinysrgb&dpr=1&h=400&w=400",
  "https://images.pexels.com/photos/29282976/pexels-photo-29282976.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=400&w=400",
  "https://images.pexels.com/photos/18041953/pexels-photo-18041953.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=400&w=400",
  "https://images.pexels.com/photos/9534265/pexels-photo-9534265.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=400&w=400",
  "https://images.pexels.com/photos/16251531/pexels-photo-16251531.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=400&w=400",
];

export default function ProfileClient({ profile }: { profile: Profile }) {
  const [phase, setPhase] = useState<"loading" | "profile" | "subscribe_modal" | "scare">("loading");
  const [scareEnded, setScareEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scareTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pick consistent random defaults
  const seed = profile.username.charCodeAt(0) % DEFAULT_PROFILE_IMGS.length;
  const profileImg = profile.profileImageUrl || DEFAULT_PROFILE_IMGS[seed];
  const coverImg = profile.coverImageUrl || DEFAULT_COVER_IMGS[seed % DEFAULT_COVER_IMGS.length];

  useEffect(() => {
    // Simulate loading like OnlyFans
    const t = setTimeout(() => {
      setPhase("profile");
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const handleSubscribeClick = () => {
    setPhase("subscribe_modal");
  };

  const handleConfirmSubscribe = () => {
    // Show scare after short delay (simulate "loading payment")
    setPhase("scare");

    // Play scream audio
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.play().catch(() => {});
    }

    // Auto-close scare after 8 seconds
    scareTimerRef.current = setTimeout(() => {
      setScareEnded(true);
    }, 8000);
  };

  const handleCloseScare = () => {
    if (scareTimerRef.current) clearTimeout(scareTimerRef.current);
    setScareEnded(true);
  };

  const scareUrl =
    profile.scareUrl && profile.scareUrl.length > 5
      ? profile.scareUrl
      : DEFAULT_SCARE_VIDEO;

  return (
    <>
      {/* Hidden audio for scream sound */}
      <audio ref={audioRef} preload="auto">
        <source src="https://www.soundjay.com/misc/sounds/scream-01.mp3" type="audio/mpeg" />
      </audio>

      {/* ===== LOADING PHASE ===== */}
      {phase === "loading" && (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
          <Header />
          {/* Cover shimmer */}
          <div className="shimmer h-48 w-full bg-gray-200" />
          <div className="max-w-3xl mx-auto w-full px-4 -mt-16 relative">
            <div className="shimmer w-32 h-32 rounded-full border-4 border-white bg-gray-300" />
            <div className="mt-4 space-y-3">
              <div className="shimmer h-6 w-48 rounded-lg bg-gray-200" />
              <div className="shimmer h-4 w-32 rounded-lg bg-gray-200" />
              <div className="shimmer h-4 w-64 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      )}

      {/* ===== PROFILE PHASE ===== */}
      {phase === "profile" && (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col fade-in">
          <Header />

          {/* Cover Photo */}
          <div className="relative h-52 md:h-64 overflow-hidden bg-gradient-to-r from-[#00aff0] to-[#0060a9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImg}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="max-w-3xl mx-auto w-full px-4 pb-12">
            {/* Profile info card */}
            <div className="bg-white rounded-b-2xl shadow-sm -mt-1 pb-6 mb-4">
              <div className="px-4 pt-0 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileImg}
                    alt={profile.displayName}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                  />
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>

                {/* Subscribe button top right */}
                <div className="flex justify-end pt-3 gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Name & stats */}
                <div className="mt-12">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">{profile.displayName}</h1>
                    <svg className="w-5 h-5 text-[#00aff0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">@{profile.username}</p>

                  {/* Stats */}
                  <div className="flex gap-6 mt-3">
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{Math.floor(Math.random() * 500 + 50)}</p>
                      <p className="text-xs text-gray-400">Gönderi</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{(Math.floor(Math.random() * 50 + 5)).toLocaleString()}K</p>
                      <p className="text-xs text-gray-400">Beğeni</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{Math.floor(Math.random() * 20 + 1)}</p>
                      <p className="text-xs text-gray-400">Medya</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="mt-3 text-sm text-gray-600">{profile.bio}</p>
                  )}
                  {!profile.bio && (
                    <p className="mt-3 text-sm text-gray-400 italic">
                      🔥 Özel içeriklerime abone olmak için butona tıkla!
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-[#00aff0]/10 text-[#00aff0] px-2 py-1 rounded-full">🔞 18+</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">📍 İstanbul</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">🌟 Top Creator</span>
                  </div>
                </div>

                {/* Subscribe CTA */}
                <div className="mt-5">
                  <button
                    onClick={handleSubscribeClick}
                    className="w-full py-3.5 bg-[#00aff0] hover:bg-[#0095cc] text-white font-bold rounded-xl transition text-sm shadow-md hover:shadow-lg"
                  >
                    ABONE OL — ÜCRETSİZ DENEME
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    İlk 30 gün ücretsiz, sonra aylık ₺49,99
                  </p>
                </div>

                {/* Payment icons */}
                <div className="flex justify-center gap-3 mt-3">
                  {["💳 Visa", "💳 MC", "🏦 IBAN", "💎 Crypto"].map((p) => (
                    <span key={p} className="text-xs text-gray-400">{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts grid - blurred/locked */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button className="flex-1 py-3 text-sm font-semibold text-[#00aff0] border-b-2 border-[#00aff0]">
                  Tümü
                </button>
                <button className="flex-1 py-3 text-sm text-gray-400 hover:text-gray-600">
                  Fotoğraflar
                </button>
                <button className="flex-1 py-3 text-sm text-gray-400 hover:text-gray-600">
                  Videolar
                </button>
              </div>

              {/* Locked posts grid */}
              <div className="p-3">
                <div className="grid grid-cols-3 gap-1">
                  {FAKE_POSTS.map((img, i) => (
                    <button
                      key={i}
                      onClick={handleSubscribeClick}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover blur-xl scale-110 group-hover:blur-lg transition"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl">🔒</div>
                          <p className="text-white text-xs font-semibold mt-1">Abone Ol</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Subscribe banner */}
                <div className="mt-4 bg-gradient-to-r from-[#00aff0] to-[#0060a9] rounded-xl p-4 text-center">
                  <p className="text-white font-bold text-sm mb-1">
                    🔓 {Math.floor(Math.random() * 200 + 50)}+ Özel İçeriğe Eriş!
                  </p>
                  <button
                    onClick={handleSubscribeClick}
                    className="mt-2 px-6 py-2 bg-white text-[#00aff0] font-bold rounded-full text-sm hover:bg-gray-50 transition"
                  >
                    Hemen Abone Ol
                  </button>
                </div>
              </div>
            </div>

            {/* Message button */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={handleSubscribeClick}
                className="flex items-center gap-2 bg-[#00aff0] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#0095cc] transition font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
                </svg>
                Mesaj At
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBSCRIBE MODAL ===== */}
      {phase === "subscribe_modal" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden fade-in">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-[#00aff0] to-[#0060a9] p-5 text-white text-center">
              <p className="text-sm font-semibold opacity-80 mb-1">Özel İçerik</p>
              <h2 className="text-xl font-black">@{profile.username} İçin Abone Ol</h2>
            </div>

            <div className="p-5">
              {/* Plan */}
              <div className="border-2 border-[#00aff0] rounded-xl p-4 mb-4 bg-[#00aff0]/5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">🌟 Premium Plan</p>
                    <p className="text-xs text-gray-500">Tüm içeriklere sınırsız erişim</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#00aff0]">₺0</p>
                    <p className="text-xs text-gray-400">ilk 30 gün</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5 text-sm text-gray-600">
                {["✅ Tüm fotoğraf ve videolar", "✅ Özel mesajlaşma", "✅ Canlı yayınlar", "✅ Özel içerikler"].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {/* Card input fake */}
              <div className="space-y-3 mb-5">
                <input
                  readOnly
                  value="•••• •••• •••• ••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-400 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input readOnly value="MM/YY" className="border border-gray-200 rounded-xl px-4 py-3 text-gray-400 text-sm" />
                  <input readOnly value="CVV" className="border border-gray-200 rounded-xl px-4 py-3 text-gray-400 text-sm" />
                </div>
              </div>

              <button
                onClick={handleConfirmSubscribe}
                className="w-full py-4 bg-[#00aff0] hover:bg-[#0095cc] text-white font-black rounded-xl transition text-base shadow-md"
              >
                ÜCRETSİZ ABONE OL 🔓
              </button>

              <button
                onClick={() => setPhase("profile")}
                className="w-full mt-2 py-3 text-gray-400 hover:text-gray-600 text-sm transition"
              >
                İptal
              </button>

              <p className="text-center text-xs text-gray-300 mt-3">
                256-bit SSL şifrelemeli güvenli ödeme
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== JUMPSCARE PHASE ===== */}
      {phase === "scare" && !scareEnded && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer"
          onClick={handleCloseScare}
        >
          {profile.scareType === "image" && profile.scareUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.scareUrl}
              alt="Scare"
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={scareUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="scare"
            />
          )}
        </div>
      )}

      {/* ===== POST SCARE ===== */}
      {scareEnded && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center fade-in">
          <div className="text-center px-4">
            <div className="text-8xl mb-6 animate-bounce">😂</div>
            <h2 className="text-3xl font-black text-white mb-3">KORKTU!</h2>
            <p className="text-gray-400 mb-6">
              Bu bir prank sitesiydi! Gerçek OnlyFans değil 😈
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a
                href="/"
                className="py-3 bg-[#00aff0] text-white font-bold rounded-xl hover:bg-[#0095cc] transition"
              >
                🔗 Sen de Prank Linki Oluştur
              </a>
              <button
                onClick={() => window.history.back()}
                className="py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition"
              >
                ← Geri Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-black tracking-tight">
            Only<span className="text-[#00aff0]">Fans</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-[#00aff0] border border-[#00aff0] rounded-full hover:bg-[#00aff0]/10 transition">
            Giriş Yap
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-[#00aff0] rounded-full hover:bg-[#0095cc] transition">
            Kayıt Ol
          </button>
        </div>
      </div>
    </header>
  );
}

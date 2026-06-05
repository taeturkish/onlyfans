"use client";

import { useState } from "react";
import Image from "next/image";

const SCARE_OPTIONS = [
  {
    id: "jumpscare_classic",
    label: "👻 Klasik Jumpscare (Cadı Yüzü)",
    type: "video",
    url: "https://www.youtube.com/embed/6VmJirYnxGE?autoplay=1&controls=0&start=0",
    preview: "😱",
    description: "En klasik jumpscare videosu",
  },
  {
    id: "upload_image",
    label: "📸 Kendi Fotoğrafını Yükle",
    type: "image",
    url: "",
    preview: "📸",
    description: "Kendi korkutucu fotoğrafını yükle",
  },
  {
    id: "upload_video",
    label: "🎬 Kendi Videonu Yükle (URL)",
    type: "custom_video",
    url: "",
    preview: "🎬",
    description: "Video URL'si gir",
  },
];

export default function HomePage() {
  const [step, setStep] = useState<"form" | "creating" | "done">("form");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedScare, setSelectedScare] = useState(SCARE_OPTIONS[0]);
  const [customUrl, setCustomUrl] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [createdLink, setCreatedLink] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(clean);
    if (clean.length < 3) setUsernameError("En az 3 karakter olmalı");
    else if (clean.length > 30) setUsernameError("En fazla 30 karakter olabilir");
    else setUsernameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || username.length < 3) {
      setError("Geçerli bir kullanıcı adı girin");
      return;
    }
    if (!displayName) {
      setError("Görünen isim gerekli");
      return;
    }

    setStep("creating");

    const scareUrl =
      selectedScare.type === "jumpscare_classic"
        ? selectedScare.url
        : customUrl;

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          displayName,
          bio,
          profileImageUrl: profileImg,
          coverImageUrl: coverImg,
          scareType: selectedScare.type === "image" ? "image" : "video",
          scareUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu");
        setStep("form");
        return;
      }

      const data = await res.json();
      const origin = window.location.origin;
      setCreatedLink(`${origin}/${data.username}`);
      setStep("done");
    } catch {
      setError("Sunucu hatası, tekrar deneyin");
      setStep("form");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* OnlyFans Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {step === "done" ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Hazır!</h2>
            <p className="text-gray-500 mb-6">Arkadaşlarına bu linki gönder:</p>
            <div className="bg-[#f0f2f5] rounded-xl p-4 mb-6 border border-gray-200">
              <p className="text-[#00aff0] font-bold text-lg break-all">{createdLink}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdLink);
                alert("Link kopyalandı! 📋");
              }}
              className="w-full py-3 bg-[#00aff0] text-white font-bold rounded-xl hover:bg-[#0095cc] transition mb-3"
            >
              📋 Linki Kopyala
            </button>
            <button
              onClick={() => {
                setStep("form");
                setUsername("");
                setDisplayName("");
                setBio("");
                setCustomUrl("");
                setProfileImg("");
                setCoverImg("");
                setSelectedScare(SCARE_OPTIONS[0]);
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              + Yeni Link Oluştur
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#00aff0]/10 text-[#00aff0] rounded-full px-4 py-2 text-sm font-semibold mb-4">
                🔗 Prank Link Oluşturucu
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                OnlyFans <span className="text-[#00aff0]">Prank</span> Linki
              </h1>
              <p className="text-gray-500">
                Arkadaşlarına gönder, açınca sürpriz bekliyor! 😈
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Kullanıcı Adı
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#00aff0] transition">
                  <span className="px-3 py-3 bg-gray-50 text-gray-400 text-sm border-r border-gray-200 font-mono">
                    onlyfans.com/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => validateUsername(e.target.value)}
                    placeholder="kullaniciadi"
                    className="flex-1 px-3 py-3 text-gray-900 outline-none text-sm"
                    maxLength={30}
                    required
                  />
                </div>
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                )}
                {username && !usernameError && (
                  <p className="text-green-500 text-xs mt-1">
                    ✓ Link: onlyfans.com/{username}
                  </p>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ✨ Görünen İsim
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Örn: Mehmet K."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#00aff0] transition text-sm"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Bio (İsteğe bağlı)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kısa bir açıklama yaz..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#00aff0] transition text-sm resize-none"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🖼️ Profil Fotoğrafı URL'si (İsteğe bağlı)
                </label>
                <input
                  type="url"
                  value={profileImg}
                  onChange={(e) => setProfileImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#00aff0] transition text-sm"
                />
              </div>

              {/* Scare Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  😱 Sürpriz Türü Seç
                </label>
                <div className="space-y-2">
                  {SCARE_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                        selectedScare.id === option.id
                          ? "border-[#00aff0] bg-[#00aff0]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="scareType"
                        value={option.id}
                        checked={selectedScare.id === option.id}
                        onChange={() => setSelectedScare(option)}
                        className="hidden"
                      />
                      <span className="text-2xl">{option.preview}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                      {selectedScare.id === option.id && (
                        <span className="ml-auto text-[#00aff0]">✓</span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Custom URL input for non-classic */}
                {(selectedScare.type === "image" || selectedScare.type === "custom_video") && (
                  <div className="mt-3">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder={
                        selectedScare.type === "image"
                          ? "Fotoğraf URL'sini gir (https://...)"
                          : "Video URL'sini gir (https://...)"
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#00aff0] transition text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedScare.type === "image"
                        ? "Doğrudan görsel bağlantısı girin"
                        : "YouTube embed URL'si veya MP4 bağlantısı girin"}
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={step === "creating" || !!usernameError}
                className="w-full py-4 bg-[#00aff0] hover:bg-[#0095cc] disabled:opacity-50 text-white font-bold rounded-xl transition text-base pulse-btn"
              >
                {step === "creating" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Oluşturuluyor...
                  </span>
                ) : (
                  "🔗 Prank Linki Oluştur"
                )}
              </button>
            </form>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-xs font-semibold text-gray-700">Gerçekçi</p>
                <p className="text-xs text-gray-400">OF arayüzü</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs font-semibold text-gray-700">Anında</p>
                <p className="text-xs text-gray-400">Hazır link</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">😈</div>
                <p className="text-xs font-semibold text-gray-700">Sürpriz</p>
                <p className="text-xs text-gray-400">Jumpscare!</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400">
        <p>© 2024 OnlyFans · Bu bir eğlence amaçlı prank sitesidir</p>
      </footer>
    </div>
  );
}

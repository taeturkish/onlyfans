import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-2xl font-black text-black tracking-tight">
            Only<span className="text-[#00aff0]">Fans</span>
          </span>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-[#00aff0] border border-[#00aff0] rounded-full">
              Giriş Yap
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-[#00aff0] rounded-full">
              Kayıt Ol
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Sayfa Bulunamadı</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Bu kullanıcı mevcut değil ya da hesabı kaldırılmış olabilir.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#00aff0] text-white font-bold rounded-xl hover:bg-[#0095cc] transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

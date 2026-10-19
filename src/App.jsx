import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Check, Bookmark, Library, BookMarked, Layers, Award } from 'lucide-react';

export default function App() {
  // LocalStorage'dan verileri çekme
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('my_books');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Nutuk', author: 'Mustafa Kemal Atatürk', category: 'Tarih' },
      { id: '2', title: 'Simyacı', author: 'Paulo Coelho', category: 'Roman' }
    ];
  });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Roman');
  const [editingId, setEditingId] = useState(null);

  // Kalıcılık
  useEffect(() => {
    localStorage.setItem('my_books', JSON.stringify(books));
  }, [books]);

  // Dinamik İstatistikler
  const totalBooks = books.length;
  const uniqueCategories = [...new Set(books.map(b => b.category))].length;
  const estimatedPages = totalBooks * 240; // Ortalama 240 sayfa varsayımı

  // 1. EKLEME (CREATE) ve GÜNCELLEME (UPDATE)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    if (editingId) {
      setBooks(books.map(book => 
        book.id === editingId ? { ...book, title, author, category } : book
      ));
      setEditingId(null);
    } else {
      const newBook = {
        id: Date.now().toString(),
        title,
        author,
        category
      };
      setBooks([newBook, ...books]);
    }

    setTitle('');
    setAuthor('');
    setCategory('Roman');
  };

  // 2. SİLME (DELETE)
  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // Düzenleme Modu
  const handleEdit = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
  };

  // Kategoriye özel renk sınıfları
  const getBadgeColor = (cat) => {
    switch (cat) {
      case 'Tarih': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Yazılım': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Kişisel Gelişim': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'; // Roman ve diğerleri
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Üst Başlık Alanı */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-3 animate-pulse">
            <Library className="text-indigo-400" size={38} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            KİŞİSEL KİTAPLIĞIM
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">Okuma serüveninizi yönetin ve arşivleyin</p>
        </div>

        {/* İstatistikler Paneli */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400 text-sm font-medium">Toplam Kitap</p>
              <h3 className="text-3xl font-black text-indigo-400 mt-1">{totalBooks}</h3>
            </div>
            <BookMarked className="text-indigo-500/30" size={40} />
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400 text-sm font-medium">Okunan Sayfa (Tahmini)</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{estimatedPages.toLocaleString()}</h3>
            </div>
            <Award className="text-emerald-500/30" size={40} />
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400 text-sm font-medium">Kategoriler</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{uniqueCategories}</h3>
            </div>
            <Layers className="text-amber-500/30" size={40} />
          </div>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-lg border border-slate-800/80 p-5 rounded-2xl shadow-2xl mb-8 flex flex-col lg:flex-row gap-3">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Kitap Adı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
            <input
              type="text"
              placeholder="Yazar Adı"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="flex-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 px-3 py-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm cursor-pointer min-w-[120px]"
            >
              <option value="Roman">Roman</option>
              <option value="Tarih">Tarih</option>
              <option value="Yazılım">Yazılım</option>
              <option value="Kişisel Gelişim">Kişisel Gelişim</option>
            </select>
            <button
              type="submit"
              className="flex-1 lg:flex-initial bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all text-sm"
            >
              {editingId ? <Check size={18} /> : <Plus size={18} />}
              {editingId ? 'Güncelle' : 'Kitap Ekle'}
            </button>
          </div>
        </form>

        {/* Kitap Listesi */}
        <div className="space-y-4">
          {books.length === 0 ? (
            <div className="text-center bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl py-12 px-4">
              <BookOpen className="mx-auto text-slate-600 mb-3" size={44} />
              <p className="text-slate-400 font-medium">Kitaplığınız henüz boş.</p>
              <p className="text-slate-500 text-xs mt-1">Yukarıdaki formdan okuduğunuz kitapları eklemeye başlayın.</p>
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  {/* Estetik Kitap Görseli İllüstrasyonu */}
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-b from-indigo-600/20 to-indigo-900/40 border border-indigo-500/10 flex flex-col justify-between p-1.5 shadow-md group-hover:from-indigo-600/30 transition-colors">
                    <div className="h-1 bg-indigo-400/50 rounded-full w-full"></div>
                    <Bookmark className="text-indigo-400 mx-auto" size={18} />
                    <div className="space-y-0.5">
                      <div className="h-0.5 bg-indigo-400/30 rounded-full w-full"></div>
                      <div className="h-0.5 bg-indigo-400/30 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-indigo-300 transition-colors">{book.title}</h3>
                    <p className="text-sm text-slate-400 font-medium">{book.author}</p>
                    <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(book.category)}`}>
                      {book.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/5 rounded-xl border border-transparent hover:border-amber-500/20 transition-all"
                    title="Düzenle"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
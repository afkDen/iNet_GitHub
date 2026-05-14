'use client';

import { useState, useRef } from 'react';
import { Camera, MapPin, Sparkles, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function PinPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleChoice = (type: 'camera' | 'file') => {
    setIsPopupOpen(false);
    if (type === 'camera') {
      cameraInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    setIsSuccessOpen(true);
    setPlaceName('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setIsSuccessOpen(false), 5000);
  };

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24 relative">
      <header className="p-6">
        <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic">aya</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center space-y-2">
          <div className="bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center mx-auto border-2 border-aya-primary/20 mb-4">
            <MapPin className="text-aya-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-aya-secondary">Drop a Pin</h2>
          <p className="text-aya-muted text-sm max-w-[250px]">Found a hidden gem? Share it with the community!</p>
        </div>

        <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl space-y-6">
          <button 
            onClick={() => setIsPopupOpen(true)}
            className="w-full aspect-video bg-aya-bg rounded-2xl border-2 border-dashed border-aya-muted/20 flex flex-col items-center justify-center gap-2 text-aya-muted hover:bg-aya-muted/5 transition-colors overflow-hidden relative"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
              </>
            )}
          </button>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Place Name</label>
              <input 
                type="text" 
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Ano'ng pangalan nito?" 
                className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary"
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="w-full bg-aya-primary text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
            Submit for Review
          </button>
        </div>

        <p className="text-[10px] text-aya-muted font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} />
          Community pins get verified by Aya
        </p>
      </main>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-black italic">Select Source</h3>
              <button onClick={() => setIsPopupOpen(false)} className="p-2 hover:bg-aya-bg rounded-full transition-colors">
                <X size={20} className="text-aya-muted" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleChoice('camera')}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-aya-bg border-2 border-transparent hover:border-aya-primary/20 transition-all active:scale-95 group"
              >
                <Camera size={28} className="text-aya-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black">Camera</span>
              </button>
              
              <button 
                onClick={() => handleChoice('file')}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-aya-bg border-2 border-transparent hover:border-aya-primary/20 transition-all active:scale-95 group"
              >
                <ImageIcon size={28} className="text-aya-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black">Files</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-[2rem] p-8 flex flex-col items-center text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-black">Success!</h3>
              <p className="text-aya-muted text-sm font-medium">Submission successful. Aya will review your pin soon!</p>
            </div>
            <button onClick={() => setIsSuccessOpen(false)} className="w-full bg-aya-primary text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
              Awesome
            </button>
          </div>
        </div>
      )}
      
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      <BottomNav />
    </div>
  );
}
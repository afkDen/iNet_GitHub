'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, X, CheckCircle2, Camera, Loader2, Utensils, Coffee, Beer, Palmtree, Ghost, Navigation, Clock, Wallet, Tag } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';
import { supabase } from '@/lib/supabase/client';

const CATEGORIES = [
  { id: 'Food', icon: <Utensils size={14} />, label: 'Kainan' },
  { id: 'Cafe', icon: <Coffee size={14} />, label: 'Coffee' },
  { id: 'Bar', icon: <Beer size={14} />, label: 'Inuman' },
  { id: 'Park', icon: <Palmtree size={14} />, label: 'Galaan' },
  { id: 'Other', icon: <Ghost size={14} />, label: 'Iba pa' },
];

const BUDGET_TIERS = [
  { id: 1, label: 'Tipid', description: '₱150 pababa' },
  { id: 2, label: 'Mid', description: '₱150 - ₱350' },
  { id: 3, label: 'Bahala Na', description: '₱350 pataas' },
];

export default function PinPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Basic Info
  const [placeName, setPlaceName] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [vibeTags, setVibeTags] = useState('');
  
  // Location Info
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  // Business / MSME Info
  const [isMsme, setIsMsme] = useState(false);
  const [hoursOpen, setHoursOpen] = useState('');
  const [hoursClose, setHoursClose] = useState('');
  const [budgetTier, setBudgetTier] = useState(2);
  const [dealText, setDealText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = placeName.trim() !== '';

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const budgetMap = {
        1: { min: 50, max: 150 },
        2: { min: 150, max: 350 },
        3: { min: 350, max: 1000 }
      };

      const selectedBudget = budgetMap[budgetTier as keyof typeof budgetMap];

      const payload = {
        id: `user-${crypto.randomUUID().slice(0, 8)}`,
        name: placeName,
        category: category.toLowerCase(),
        description: description,
        vibe_tags: vibeTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        address: address,
        city: city || 'Unknown',
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        opens_at: isMsme ? hoursOpen : null,
        closes_at: isMsme ? hoursClose : null,
        cost_min: isMsme ? selectedBudget.min : 150,
        cost_max: isMsme ? selectedBudget.max : 350,
        deal_text: isMsme ? dealText : null,
        is_community_pin: true,
        is_deal: !!dealText,
        is_open: true,
        community_confirms: 1,
        rating: 4.5
      };

      console.log('Submitting pin to establishments:', payload);
      
      const { data, error } = await supabase
        .from('establishments')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Submission successful:', data);

      setIsSuccessOpen(true);
      // Reset form
      setPlaceName('');
      setDescription('');
      setVibeTags('');
      setCategory('Food');
      setAddress('');
      setCity('');
      setLat('');
      setLng('');
      setIsMsme(false);
      setHoursOpen('');
      setHoursClose('');
      setBudgetTier(2);
      setDealText('');
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setTimeout(() => setIsSuccessOpen(false), 5000);
    } catch (err: any) {
      console.error('Failed to submit pin:', err);
      alert(`May problem sa pag-save: ${err.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24 relative overflow-y-auto">
      <header className="p-6">
        <Link href="/">
          <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic cursor-pointer">aya</h1>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 gap-8 pb-32">
        <div className="text-center space-y-2">
          <div className="bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center mx-auto border-2 border-aya-primary/20 mb-4">
            <MapPin className="text-aya-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-aya-secondary">Drop a Pin</h2>
          <p className="text-aya-muted text-sm max-w-[250px]">Share a hidden gem or your own business with the community!</p>
        </div>

        <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl space-y-8">
          {/* Photo Section */}
          <button 
            onClick={handleAddPhotoClick}
            className="w-full aspect-video bg-aya-bg rounded-2xl border-2 border-dashed border-aya-muted/20 flex flex-col items-center justify-center gap-2 text-aya-muted hover:bg-aya-muted/5 transition-colors overflow-hidden relative"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Photo (Optional)</span>
              </>
            )}
          </button>

          {/* Section: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-aya-primary">
                <Tag size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">Basic Information</h3>
            </div>
            
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

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      category === cat.id 
                        ? 'bg-aya-primary text-white shadow-md scale-105' 
                        : 'bg-aya-bg text-aya-muted hover:bg-aya-muted/10'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-4 pt-4 border-t border-aya-muted/10">
            <div className="flex items-center gap-2 text-aya-primary">
                <Navigation size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">Location</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Address</label>
                    <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street / Area" 
                        className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">City</label>
                    <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City" 
                        className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Latitude</label>
                    <input 
                        type="number" 
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="14.5995" 
                        step="any"
                        className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Longitude</label>
                    <input 
                        type="number" 
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="120.9842" 
                        step="any"
                        className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                    />
                </div>
            </div>
          </div>

          {/* Section: Vibe & Description */}
          <div className="space-y-4 pt-4 border-t border-aya-muted/10">
            <div className="flex items-center gap-2 text-aya-primary">
                <Sparkles size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">The Vibe</h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bakit mo ito nire-recommend?" 
                rows={3}
                className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary resize-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Vibe Tags (comma separated)</label>
              <input 
                type="text" 
                value={vibeTags}
                onChange={(e) => setVibeTags(e.target.value)}
                placeholder="e.g. Chill, Aesthetic, Budget" 
                className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
              />
            </div>
          </div>

          {/* Section: Business / MSME (Conditional) */}
          <div className="space-y-4 pt-4 border-t border-aya-muted/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-aya-primary">
                    <Wallet size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Business Owner?</h3>
                </div>
                <button 
                    onClick={() => setIsMsme(!isMsme)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${isMsme ? 'bg-aya-primary' : 'bg-aya-muted/20'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isMsme ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            {isMsme && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1 flex items-center gap-1">
                                <Clock size={10} /> Opens At
                            </label>
                            <input 
                                type="text" 
                                value={hoursOpen}
                                onChange={(e) => setHoursOpen(e.target.value)}
                                placeholder="8:00 AM" 
                                className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1 flex items-center gap-1">
                                <Clock size={10} /> Closes At
                            </label>
                            <input 
                                type="text" 
                                value={hoursClose}
                                onChange={(e) => setHoursClose(e.target.value)}
                                placeholder="10:00 PM" 
                                className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Budget Tier</label>
                        <div className="grid grid-cols-3 gap-2">
                            {BUDGET_TIERS.map((tier) => (
                                <button
                                    key={tier.id}
                                    onClick={() => setBudgetTier(tier.id)}
                                    className={`p-2 rounded-xl text-[10px] font-bold transition-all border-2 ${
                                        budgetTier === tier.id 
                                            ? 'border-aya-primary bg-white text-aya-primary shadow-sm' 
                                            : 'border-transparent bg-aya-bg text-aya-muted'
                                    }`}
                                >
                                    {tier.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Special Deal / Promo</label>
                        <input 
                            type="text" 
                            value={dealText}
                            onChange={(e) => setDealText(e.target.value)}
                            placeholder="e.g. 10% off for Barkada" 
                            className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary text-sm"
                        />
                    </div>
                </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit} 
            disabled={!isFormValid || loading}
            className={`w-full font-black py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2
              ${isFormValid && !loading
                ? 'bg-aya-primary text-white active:scale-95' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              'Submit for Review'
            )}
          </button>
        </div>

        <p className="text-[10px] text-aya-muted font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} />
          Community pins get verified by Aya
        </p>
      </main>

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

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      <BottomNav />
    </div>
  );
}
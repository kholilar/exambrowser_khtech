import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Rocket, ArrowLeft, Scan, AlertTriangle, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('VERIFY_CODE'); // VERIFY_CODE, SETUP_PINNING, HOME, SCANNER, EXAM, LOCKED
  const [accessCode, setAccessCode] = useState('');
  const [violationCount, setViolationCount] = useState(0);
  const [showAlert, setShowAlert] = useState(null);
  const [activeUrl, setActiveUrl] = useState('');
  
  // State untuk Exit Password
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitPin, setExitPin] = useState('');

  const MAX_VIOLATIONS = 3;
  const HARDCODED_EXAM_URL = 'https://id.wikipedia.org'; 

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (currentScreen === 'EXAM' && document.hidden) {
        handleViolation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentScreen, violationCount]);

  const handleViolation = () => {
    const newCount = violationCount + 1;
    setViolationCount(newCount);

    if (newCount >= MAX_VIOLATIONS) {
      setCurrentScreen('LOCKED');
    } else {
      setShowAlert({
        title: "PERINGATAN KECURANGAN",
        message: `Anda meninggalkan halaman!\nPeringatan ke: ${newCount} dari ${MAX_VIOLATIONS}.`,
        isError: true
      });
      setTimeout(() => setShowAlert(null), 5000);
    }
  };

  const startExam = (url) => {
    setActiveUrl(url);
    setViolationCount(0);
    setCurrentScreen('EXAM');
  };

  const verifyCode = () => {
    if (accessCode === '12345') {
      setCurrentScreen('SETUP_PINNING');
      setAccessCode('');
      setShowAlert(null);
    } else {
      setShowAlert({ title: "Akses Ditolak", message: "PIN Salah!", isError: true });
      setTimeout(() => setShowAlert(null), 3000);
    }
  };

  // Fungsi Verifikasi PIN Keluar Ujian
  const verifyExit = () => {
    if (exitPin === '99999') {
      setShowExitModal(false);
      setExitPin('');
      setCurrentScreen('HOME');
      setActiveUrl('');
    } else {
      setShowAlert({ title: "Akses Ditolak", message: "PIN Pengawas Salah!", isError: true });
      setTimeout(() => setShowAlert(null), 3000);
    }
  };

  const renderScreen = () => {
    if (currentScreen === 'VERIFY_CODE') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 relative">
          {/* Background Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
          
          <div className="z-10 w-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-600/50 flex items-center justify-center mb-6 shadow-inner">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Otorisasi Diperlukan</h2>
            <p className="text-slate-400 text-xs mb-6 text-center">Masukkan PIN akses dari pengawas</p>
            
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="•••••"
              maxLength={5}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-4 text-center text-3xl text-white font-black tracking-[0.5em] focus:border-cyan-500 focus:outline-none transition-colors mb-6 shadow-inner"
            />
            
            <button 
              onClick={verifyCode}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] text-sm tracking-wider"
            >
              BUKA KUNCI
            </button>
          </div>
          
          {/* Footer Web */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-[9px] text-slate-600 font-bold tracking-[0.2em] z-20">DEVELOP BY KH TECH</p>
        </div>
      );
    }

    if (currentScreen === 'SETUP_PINNING') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          
          <div className="z-10 w-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1 tracking-wide">Langkah Keamanan</h2>
            <p className="text-emerald-400 text-xs font-semibold mb-6">Wajib Aktifkan Penyematan Layar</p>
            
            <div className="w-full space-y-4 mb-6 bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">1</div>
                <p className="text-slate-300 text-xs leading-relaxed">Buka menu <span className="text-white font-bold">Recent Apps</span></p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">2</div>
                <p className="text-slate-300 text-xs leading-relaxed">Ketuk <span className="text-white font-bold">Logo App</span> di atas</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">3</div>
                <p className="text-slate-300 text-xs leading-relaxed">Pilih <span className="text-emerald-400 font-bold">Sematkan / Pin App</span></p>
              </div>
            </div>
            
            <div className="w-full bg-red-900/20 border border-red-500/30 p-3 rounded-xl mb-6">
              <p className="text-red-300 text-[10px] text-center leading-relaxed">
                ⚠️ Gagal menyematkan akan membuat ujian otomatis terkunci jika keluar.
              </p>
            </div>
            
            <button 
              onClick={() => setCurrentScreen('HOME')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs tracking-wider"
            >
              SAYA SUDAH MENYEMATKAN
            </button>
          </div>

          {/* Footer Web */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-[9px] text-slate-600 font-bold tracking-[0.2em] z-20">DEVELOP BY KH TECH</p>
        </div>
      );
    }

    if (currentScreen === 'HOME') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          
          <div className="z-10 w-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-emerald-500 tracking-widest drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">R-DEV</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] mt-1">SECURE V2</p>
            </div>
            
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-emerald-500/30 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Rocket className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2 tracking-wide">Pilih Server Ujian</h2>
            <p className="text-slate-400 text-xs text-center mb-8 px-2 leading-relaxed">
              Gunakan server utama atau scan QR Code alternatif dari pengawas.
            </p>
            
            <div className="w-full space-y-4">
              <button 
                onClick={() => startExam(HARDCODED_EXAM_URL)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-4 rounded-2xl flex justify-center items-center text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/20"
              >
                SERVER UTAMA
              </button>
              
              <button 
                onClick={() => setCurrentScreen('SCANNER')}
                className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold py-4 rounded-2xl flex justify-center items-center text-xs tracking-widest transition-all border border-slate-600/50"
              >
                <Scan className="w-4 h-4 mr-2" />
                SCAN QR CODE
              </button>
            </div>
          </div>
          
          {/* Footer Web */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-[9px] text-slate-600 font-bold tracking-[0.2em] z-20">DEVELOP BY KH TECH</p>
        </div>
      );
    }

    if (currentScreen === 'SCANNER') {
      return (
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950">
            {/* Simulated Camera Feed Background */}
            <div className="w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 to-slate-950"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-56 h-56 relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl"></div>
              {/* Scanning line */}
              <div className="w-full h-[2px] bg-emerald-400 absolute top-1/2 left-0 shadow-[0_0_15px_rgba(52,211,153,1)] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </div>
          </div>
          
          <div className="pt-12 px-6 pb-4 z-20 flex flex-col h-full">
            <h2 className="text-white font-bold text-center text-sm tracking-widest mb-2 shadow-black drop-shadow-md">SCAN QR UJIAN</h2>
            <p className="text-slate-300 text-[10px] text-center mb-auto opacity-80">Arahkan kamera ke QR Server</p>
            
            <div className="flex flex-col space-y-4 mb-8 mt-auto">
              <button 
                onClick={() => startExam('https://id.wikipedia.org')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl flex justify-center items-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] text-xs tracking-wider border border-emerald-400/30 w-full"
              >
                <Scan className="w-4 h-4 mr-2" />
                SIMULASI SUKSES SCAN
              </button>
              
              <button 
                onClick={() => setCurrentScreen('HOME')}
                className="bg-slate-800/80 text-white font-bold py-4 rounded-2xl flex justify-center items-center transition-all border border-slate-600/50 text-xs tracking-wider w-full backdrop-blur-sm"
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentScreen === 'EXAM') {
      return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-[32px] relative">
          <div className="bg-slate-950 text-white px-4 py-3 pt-10 flex justify-between items-center z-10 border-b border-slate-800 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-xs tracking-wider">CBT <span className="text-emerald-400">CONNECTED</span></span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-red-900/30 border border-red-500/50 px-2 py-1 rounded text-[10px] font-bold text-red-300">
                {violationCount}/{MAX_VIOLATIONS}
              </div>
              
              {/* Tombol Selesai/Keluar Ujian */}
              <button 
                onClick={() => setShowExitModal(true)}
                className="bg-red-600 hover:bg-red-500 p-1.5 rounded-lg transition-colors border border-red-400/50 shadow-[0_0_10px_rgba(220,38,38,0.4)]"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-100 relative">
            <iframe 
              src={activeUrl} 
              className="w-full h-full absolute top-0 left-0 border-0"
              title="Exam Content"
            />
          </div>

          {/* Modal Keluar Ujian */}
          {showExitModal && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center animate-[slideDown_0.2s_ease-out]">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4 border border-red-500/30">
                  <Lock className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-white font-bold text-sm tracking-widest mb-1">SELESAI UJIAN</h3>
                <p className="text-slate-400 text-[10px] text-center mb-6">Minta pengawas memasukkan PIN untuk keluar dari sistem.</p>
                
                <input
                  type="password"
                  value={exitPin}
                  onChange={(e) => setExitPin(e.target.value)}
                  placeholder="PIN"
                  maxLength={5}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 text-center text-xl text-white font-black tracking-[0.5em] focus:border-red-500 focus:outline-none transition-colors mb-4"
                />
                
                <div className="flex space-x-3 w-full">
                  <button 
                    onClick={() => {setShowExitModal(false); setExitPin('');}}
                    className="flex-1 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs tracking-wider hover:bg-slate-700 transition-colors"
                  >
                    BATAL
                  </button>
                  <button 
                    onClick={verifyExit}
                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl text-xs tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-500 transition-colors"
                  >
                    KELUAR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (currentScreen === 'LOCKED') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-red-950 relative">
          <div className="z-10 w-full bg-slate-900/80 backdrop-blur-md border border-red-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-900/50 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-red-500 mb-2 tracking-wider">DIBLOKIR</h2>
            <p className="text-red-200 text-xs text-center mb-8 leading-relaxed">
              Anda telah melanggar protokol keamanan sebanyak {MAX_VIOLATIONS} kali.
            </p>
            <button 
              onClick={() => {setCurrentScreen('HOME'); setViolationCount(0);}}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] text-xs tracking-wider"
            >
              KEMBALI KE AWAL
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans select-none">
      
      {/* Alert Overlay */}
      {showAlert && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-950/90 border border-red-500/50 p-4 rounded-2xl shadow-2xl backdrop-blur-sm flex items-center animate-[slideDown_0.3s_ease-out] w-80">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-bold text-xs">{showAlert.title}</h3>
            <p className="text-white text-[10px] whitespace-pre-line mt-1">{showAlert.message}</p>
          </div>
        </div>
      )}

      {/* Mockup Frame */}
      <div className="relative w-[360px] h-[720px] bg-slate-950 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[8px] border-slate-800 overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-50"></div>
        
        {/* Screen Content */}
        {renderScreen()}
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 h-1 w-1/3 bg-slate-600 rounded-full mx-auto z-50"></div>
      </div>
      
      <p className="text-slate-500 text-xs mt-6 font-medium">✨ Simulasi Tampilan HP (Mobile View)</p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { PerencanaanView } from './components/PerencanaanView';
import { ObservasiView } from './components/ObservasiView';
import { PortofolioView } from './components/PortofolioView';
import { LaporanView } from './components/LaporanView';
import { MaterialGeneratorView } from './components/MaterialGeneratorView';
import { SettingsView } from './components/SettingsView';
import { InstrumenKemendikbudView } from './components/InstrumenKemendikbudView';
import { CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, activeTab, isLoading, notification } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Memuat Sistem DiPandu...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show professional login view
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <main className="flex-1">
          <LoginModal />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Header */}
      <Header />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-medium max-w-sm ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-800'
                : notification.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-800'
                : 'bg-slate-900 text-slate-50 border-slate-800'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'perencanaan' && <PerencanaanView />}
        {activeTab === 'observasi' && <ObservasiView />}
        {activeTab === 'portofolio' && <PortofolioView />}
        {activeTab === 'instrumen' && <InstrumenKemendikbudView />}
        {activeTab === 'generator' && <MaterialGeneratorView />}
        {activeTab === 'laporan' && <LaporanView />}
        {activeTab === 'pengaturan' && <SettingsView />}
      </main>

      {/* Mandatory Footer with @copyright by. Pak GuruAI */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Perencanaan,
  Observasi,
  TindakLanjut,
  Portofolio,
  SekolahBinaan,
  AppSettings,
} from '../types';
import { api } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  settings: AppSettings;
  users: User[];
  sekolahBinaan: SekolahBinaan[];
  perencanaanList: Perencanaan[];
  observasiList: Observasi[];
  tindakLanjutList: TindakLanjut[];
  portofolioList: Portofolio[];
  rekapData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (user: User) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  refreshAll: () => Promise<void>;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  // Specific action helpers
  addPerencanaan: (data: Partial<Perencanaan>) => Promise<boolean>;
  reviewPerencanaan: (id: string, status: string, catatan: string) => Promise<boolean>;
  addObservasi: (data: Partial<Observasi>) => Promise<boolean>;
  submitRefleksi: (id: string, refleksi: string, rencanaPerbaikan: string) => Promise<boolean>;
  addTindakLanjut: (data: Partial<TindakLanjut>) => Promise<boolean>;
  updateTindakLanjut: (id: string, data: Partial<TindakLanjut>) => Promise<boolean>;
  addPortofolio: (data: Partial<Portofolio>) => Promise<boolean>;
  deletePortofolio: (id: string) => Promise<boolean>;
  createUser: (data: Partial<User>) => Promise<boolean>;
  registerGuru: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  addSekolahBinaan: (data: Partial<SekolahBinaan>) => Promise<boolean>;
  updateSekolahBinaan: (id: string, data: Partial<SekolahBinaan>) => Promise<boolean>;
  deleteSekolahBinaan: (id: string) => Promise<boolean>;
}

const defaultSettings: AppSettings = {
  institutionName: 'Sekolah Binaan H. Kusnandar, M.Si',
  copyright: '@copyright by. Pak GuruAI',
  tahunAjaranAktif: '2026/2027',
  semesterAktif: 'Ganjil',
  pengawasPembina: 'H. Kusnandar, M.Si',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [users, setUsers] = useState<User[]>([]);
  const [sekolahBinaan, setSekolahBinaan] = useState<SekolahBinaan[]>([]);
  const [perencanaanList, setPerencanaanList] = useState<Perencanaan[]>([]);
  const [observasiList, setObservasiList] = useState<Observasi[]>([]);
  const [tindakLanjutList, setTindakLanjutList] = useState<TindakLanjut[]>([]);
  const [portofolioList, setPortofolioList] = useState<Portofolio[]>([]);
  const [rekapData, setRekapData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const refreshAll = async () => {
    try {
      const [
        settingsRes,
        usersRes,
        sekolahRes,
        perencanaanRes,
        observasiRes,
        tlRes,
        portofolioRes,
        rekapRes,
      ] = await Promise.all([
        api.getSettings(),
        api.getUsers(),
        api.getSekolah(),
        api.getPerencanaan(),
        api.getObservasi(),
        api.getTindakLanjut(),
        api.getPortofolio(),
        api.getRekap(),
      ]);

      if (settingsRes.success) setSettings(settingsRes.settings);
      if (usersRes.success) setUsers(usersRes.users);
      if (sekolahRes.success) setSekolahBinaan(sekolahRes.sekolahBinaan);
      if (perencanaanRes.success) setPerencanaanList(perencanaanRes.data);
      if (observasiRes.success) setObservasiList(observasiRes.data);
      if (tlRes.success) setTindakLanjutList(tlRes.data);
      if (portofolioRes.success) setPortofolioList(portofolioRes.data);
      if (rekapRes.success) setRekapData(rekapRes.rekap);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      if (res.settings) setSettings(res.settings);
      showNotification(`Selamat datang kembali, ${res.user.nama}`, 'success');
      return { success: true };
    }
    return { success: false, message: res.message || 'Login gagal.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    showNotification('Sesi berhasil diakhiri.', 'info');
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    showNotification(`Beralih ke peran: ${user.role.toUpperCase()} (${user.nama})`, 'info');
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const res = await api.updateSettings(newSettings);
    if (res.success) {
      setSettings(res.settings);
      showNotification('Pengaturan lembaga berhasil diperbarui.', 'success');
      refreshAll();
    }
  };

  const addPerencanaan = async (data: Partial<Perencanaan>) => {
    const res = await api.uploadPerencanaan(data);
    if (res.success) {
      showNotification('Dokumen perencanaan berhasil diunggah.', 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const reviewPerencanaan = async (id: string, status: string, catatan: string) => {
    const res = await api.reviewPerencanaan(id, status, catatan);
    if (res.success) {
      showNotification(`Status dokumen diubah menjadi: ${status}`, 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const addObservasi = async (data: Partial<Observasi>) => {
    const res = await api.createObservasi(data);
    if (res.success) {
      showNotification('Penilaian rubrik observasi kelas berhasil disimpan.', 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const submitRefleksi = async (id: string, refleksi: string, rencanaPerbaikan: string) => {
    const res = await api.submitRefleksi(id, refleksi, rencanaPerbaikan);
    if (res.success) {
      showNotification('Refleksi mandiri guru berhasil dikirimkan.', 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const addTindakLanjut = async (data: Partial<TindakLanjut>) => {
    const res = await api.createTindakLanjut(data);
    if (res.success) {
      showNotification('Rencana tindak lanjut (RTL) berhasil ditambahkan.', 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const updateTindakLanjut = async (id: string, data: Partial<TindakLanjut>) => {
    const res = await api.updateTindakLanjut(id, data);
    if (res.success) {
      showNotification('Perkembangan tindak lanjut berhasil diperbarui.', 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const addPortofolio = async (data: Partial<Portofolio>) => {
    const res = await api.createPortofolio(data);
    if (res.success) {
      showNotification('Dokumen portofolio baru berhasil diunggah.', 'success');
      await refreshAll();
      return true;
    }
    return false;
  };

  const deletePortofolio = async (id: string) => {
    const res = await api.deletePortofolio(id);
    if (res.success) {
      showNotification('Portofolio berhasil dihapus.', 'info');
      await refreshAll();
      return true;
    }
    return false;
  };

  const createUser = async (data: Partial<User>) => {
    const res = await api.createUser(data);
    if (res.success) {
      showNotification('Akun pengguna baru berhasil ditambahkan.', 'success');
      await refreshAll();
      return true;
    } else {
      showNotification(res.message || 'Gagal menambahkan pengguna.', 'error');
      return false;
    }
  };

  const registerGuru = async (data: Partial<User>) => {
    const res = await api.register(data);
    if (res.success && res.user) {
      showNotification(res.message || 'Pendaftaran akun guru berhasil!', 'success');
      await refreshAll();
      // Auto login the newly registered teacher
      if (data.username && data.password) {
        await login(data.username, data.password);
      }
      return { success: true };
    } else {
      showNotification(res.message || 'Gagal melakukan pendaftaran guru.', 'error');
      return { success: false, message: res.message };
    }
  };

  const addSekolahBinaan = async (data: Partial<SekolahBinaan>) => {
    const res = await api.createSekolah(data);
    if (res.success) {
      showNotification(`Sekolah binaan "${data.nama}" berhasil ditambahkan.`, 'success');
      await refreshAll();
      return true;
    } else {
      showNotification(res.message || 'Gagal menambahkan sekolah binaan.', 'error');
      return false;
    }
  };

  const updateSekolahBinaan = async (id: string, data: Partial<SekolahBinaan>) => {
    const res = await api.updateSekolah(id, data);
    if (res.success) {
      showNotification('Data sekolah binaan berhasil diperbarui.', 'success');
      await refreshAll();
      return true;
    } else {
      showNotification(res.message || 'Gagal memperbarui sekolah binaan.', 'error');
      return false;
    }
  };

  const deleteSekolahBinaan = async (id: string) => {
    const res = await api.deleteSekolah(id);
    if (res.success) {
      showNotification('Sekolah binaan berhasil dihapus dari daftar.', 'info');
      await refreshAll();
      return true;
    } else {
      showNotification(res.message || 'Gagal menghapus sekolah binaan.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        settings,
        users,
        sekolahBinaan,
        perencanaanList,
        observasiList,
        tindakLanjutList,
        portofolioList,
        rekapData,
        activeTab,
        setActiveTab,
        isLoading,
        login,
        logout,
        switchUser,
        updateSettings,
        refreshAll,
        notification,
        showNotification,
        addPerencanaan,
        reviewPerencanaan,
        addObservasi,
        submitRefleksi,
        addTindakLanjut,
        updateTindakLanjut,
        addPortofolio,
        deletePortofolio,
        createUser,
        registerGuru,
        addSekolahBinaan,
        updateSekolahBinaan,
        deleteSekolahBinaan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

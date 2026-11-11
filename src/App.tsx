import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './lib/firebase';
import { TabType, Medicine, Invoice, CartItem, ShiftInfo, Customer, KhataTransaction, PurchaseOrder, Supplier } from './types';
import { initialShift } from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PosView } from './components/PosView';
import { InventoryView } from './components/InventoryView';
import { SalesView } from './components/SalesView';
import { AiAssistantView } from './components/AiAssistantView';
import { PlaceholderView } from './components/PlaceholderView';
import { QuickSaleModal } from './components/QuickSaleModal';
import { AddMedicineModal } from './components/AddMedicineModal';
import { SettingsView } from './components/SettingsView';
import { PrintableInvoice } from './components/PrintableInvoice';
import { LoginView } from './components/LoginView';
import { CustomersKhataView } from './components/CustomersKhataView';
import { EditMedicineModal } from './components/EditMedicineModal';
import { PurchasesView } from './components/PurchasesView';
import { SuppliersView } from './components/SuppliersView';
import { ReportsView } from './components/ReportsView';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('talha_user_session');
    const profile = saved ? JSON.parse(saved) : {
      name: localStorage.getItem('talha_operator_name') || 'Admin / Owner',
      email: 'owner@talhasurgical.pk',
      role: localStorage.getItem('talha_operator_role') || 'System Administrator',
      photoURL: localStorage.getItem('talha_operator_avatar') || ''
    };
    if (profile) {
      profile.name = localStorage.getItem('talha_operator_name') || profile.name;
      profile.role = localStorage.getItem('talha_operator_role') || profile.role;
      profile.photoURL = localStorage.getItem('talha_operator_avatar') || profile.photoURL;
    }
    return profile;
  });

  useEffect(() => {
    const storeName = localStorage.getItem('talha_store_name') || 'Talha Surgical & Medicine Shop';
    const storeLogo = localStorage.getItem('talha_store_logo');
    document.title = `${storeName} - Pharmacy Management System`;
    if (storeLogo) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = storeLogo;
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const storeName = localStorage.getItem('talha_store_name') || 'Talha Surgical & Medicine Shop';
      const storeLogo = localStorage.getItem('talha_store_logo');
      document.title = `${storeName} - Pharmacy Management System`;
      if (storeLogo) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = storeLogo;
      }
      setUserProfile(prev => prev ? {
        ...prev,
        name: localStorage.getItem('talha_operator_name') || prev.name,
        role: localStorage.getItem('talha_operator_role') || prev.role,
        photoURL: localStorage.getItem('talha_operator_avatar') || prev.photoURL
      } : {
        name: localStorage.getItem('talha_operator_name') || 'Admin / Owner',
        email: 'owner@talhasurgical.pk',
        role: localStorage.getItem('talha_operator_role') || 'System Administrator',
        photoURL: localStorage.getItem('talha_operator_avatar') || ''
      });
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'ANTIBIOTIC',
    'ANALGESIC',
    'COLD CHAIN',
    'SURGICAL',
    'GASTROENTEROLOGY',
    'ANTACID',
    'SYRUP',
    'INJECTION',
    'DERMATOLOGY',
    'VITAMINS & SUPPLEMENTS'
  ]);
  const [shift, setShift] = useState<ShiftInfo>(initialShift);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [printingInvoice, setPrintingInvoice] = useState<Invoice | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [credentials, setCredentials] = useState<{ username: string; password: string }>(() => {
    const saved = localStorage.getItem('talha_auth_credentials');
    return saved ? JSON.parse(saved) : { username: 'admin', password: 'talha123' };
  });

  // Sync credentials from Firestore settings/auth document
  useEffect(() => {
    const unsubAuthSettings = onSnapshot(doc(db, 'settings', 'auth'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.password) {
          const creds = { username: data.username || 'admin', password: data.password };
          setCredentials(creds);
          localStorage.setItem('talha_auth_credentials', JSON.stringify(creds));
        }
      } else {
        setDoc(doc(db, 'settings', 'auth'), {
          username: 'admin',
          password: 'talha123',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
    }, (error) => {
      console.log('Using local store credentials', error);
    });

    return () => unsubAuthSettings();
  }, []);

  const [storeAddress, setStoreAddress] = useState<string>('Opposite DHQ Hospital, Punjab');
  const [revenueResetAt, setRevenueResetAt] = useState<number>(() => {
    return parseInt(localStorage.getItem('talha_revenue_reset_at') || '0');
  });

  useEffect(() => {
    const unsubStoreSettings = onSnapshot(doc(db, 'settings', 'store'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.address) {
          setStoreAddress(data.address);
        }
      } else {
        setDoc(doc(db, 'settings', 'store'), {
          address: 'Opposite DHQ Hospital, Punjab',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
    }, (error) => {
      console.log('Using default store address', error);
    });

    const unsubRevenueSettings = onSnapshot(doc(db, 'settings', 'revenue'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.lastResetAt) {
          setRevenueResetAt(data.lastResetAt);
          localStorage.setItem('talha_revenue_reset_at', data.lastResetAt.toString());
        }
      }
    });

    return () => {
      unsubStoreSettings();
      unsubRevenueSettings();
    };
  }, []);

  const handleUpdateStoreAddress = async (newAddress: string): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'settings', 'store'), {
        address: newAddress,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setStoreAddress(newAddress);
      return true;
    } catch (e) {
      console.error('Failed to update address', e);
      return false;
    }
  };

  const handleUpdatePassword = async (newPass: string): Promise<boolean> => {
    try {
      const updated = { ...credentials, password: newPass };
      await setDoc(doc(db, 'settings', 'auth'), {
        username: credentials.username,
        password: newPass,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setCredentials(updated);
      localStorage.setItem('talha_auth_credentials', JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Failed to update password in Firestore', e);
      const updated = { ...credentials, password: newPass };
      setCredentials(updated);
      localStorage.setItem('talha_auth_credentials', JSON.stringify(updated));
      return true;
    }
  };

  // Fetch real-time data from Firestore (medicines, invoices, customers)
  useEffect(() => {
    const unsubMedicines = onSnapshot(collection(db, 'medicines'), (snapshot) => {
      const items: Medicine[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...(docSnap.data() as Medicine), id: docSnap.id });
      });
      setMedicines(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'medicines');
    });

    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      const items: Invoice[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Invoice);
      });
      items.sort((a, b) => b.id.localeCompare(a.id));
      setInvoices(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'invoices');
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const items: Customer[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...(docSnap.data() as Customer), id: docSnap.id });
      });
      items.sort((a, b) => (b.totalDebt || 0) - (a.totalDebt || 0));
      setCustomers(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'customers');
    });

    const unsubPurchases = onSnapshot(collection(db, 'purchases'), (snapshot) => {
      const items: PurchaseOrder[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...(docSnap.data() as PurchaseOrder), id: docSnap.id });
      });
      items.sort((a, b) => b.id.localeCompare(a.id));
      setPurchases(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'purchases');
    });

    const unsubSuppliers = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
      const items: Supplier[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...(docSnap.data() as Supplier), id: docSnap.id });
      });
      setSuppliers(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'suppliers');
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const items: string[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d?.name) items.push(String(d.name).toUpperCase());
      });
      if (items.length > 0) {
        setCategories(prev => Array.from(new Set([...prev, ...items])));
      }
    }, () => {});

    return () => {
      unsubMedicines();
      unsubInvoices();
      unsubCustomers();
      unsubPurchases();
      unsubSuppliers();
      unsubCategories();
    };
  }, []);

  // Keyboard shortcuts (F2, F3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setCurrentTab('pos');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setIsAddMedicineOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddMedicine = async (newMed: Medicine) => {
    try {
      await setDoc(doc(db, 'medicines', newMed.id), newMed);
      alert(`Medicine "${newMed.name}" saved successfully!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `medicines/${newMed.id}`);
    }
  };

  const handleUpdateMedicine = async (updatedMed: Medicine) => {
    try {
      await setDoc(doc(db, 'medicines', updatedMed.id), updatedMed);
      alert(`Medicine "${updatedMed.name}" updated successfully!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `medicines/${updatedMed.id}`);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (!id) return;
    try {
      const docRef = doc(db, 'medicines', id);
      await deleteDoc(docRef);
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Record permanently removed from database.');
    } catch (error) {
      alert('Delete failed. Please check your connection.');
      handleFirestoreError(error, OperationType.DELETE, `medicines/${id}`);
    }
  };

  const handleAddCustomer = async (data: Omit<Customer, 'id' | 'transactions' | 'totalDebt'> & { initialDebt?: number }) => {
    const custId = `cust-${Date.now()}`;
    const initialDebt = Number(data.initialDebt || 0);
    const initialTxns: KhataTransaction[] = initialDebt > 0 ? [{
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'CREDIT_PURCHASE',
      description: 'Initial Opening Udhar Balance',
      amount: initialDebt,
      remainingBalance: initialDebt
    }] : [];

    const newCust: Customer = {
      id: custId,
      name: data.name,
      phone: data.phone,
      cnic: data.cnic || '',
      address: data.address || '',
      creditLimit: data.creditLimit || 20000,
      totalDebt: initialDebt,
      lastTransactionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      transactions: initialTxns
    };

    try {
      await setDoc(doc(db, 'customers', custId), newCust);
      alert(`Khata Account for "${newCust.name}" created successfully!`);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `customers/${custId}`);
    }
  };

  const handleUpdateCustomer = async (customerId: string, data: Partial<Customer>) => {
    try {
      await updateDoc(doc(db, 'customers', customerId), data);
      alert('Customer details updated successfully.');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `customers/${customerId}`);
    }
  };

  const handleAddKhataTransaction = async (customerId: string, transaction: Omit<KhataTransaction, 'id' | 'remainingBalance'>) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const txId = `tx-${Date.now()}`;
    const delta = transaction.type === 'CREDIT_PURCHASE' ? transaction.amount : -transaction.amount;
    const newDebt = Math.max(0, (cust.totalDebt || 0) + delta);

    const newTx: KhataTransaction = {
      ...transaction,
      id: txId,
      remainingBalance: newDebt
    };

    const updatedTxns = [newTx, ...(cust.transactions || [])];

    try {
      await updateDoc(doc(db, 'customers', customerId), {
        totalDebt: newDebt,
        lastTransactionDate: newTx.date,
        transactions: updatedTxns
      });
      alert(`Khata updated for "${cust.name}". New Balance: Rs. ${newDebt.toFixed(2)}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `customers/${customerId}`);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this Khata account and all its history?')) return;
    try {
      await deleteDoc(doc(db, 'customers', customerId));
      alert('Khata account deleted successfully.');
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `customers/${customerId}`);
    }
  };

  const handleDeleteKhataTransaction = async (customerId: string, txnId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust || !cust.transactions) return;

    if (!window.confirm('Delete this transaction entry? This will also recalculate the total balance.')) return;

    const filteredTxns = cust.transactions.filter(t => t.id !== txnId);
    
    // Recalculate total debt from history
    // Note: We need to sort by date/time ideally, but they are strings.
    // For now, let's just sum up the remaining balance logic if we were to replay them, 
    // or more simply, just adjust the totalDebt by the removed transaction's impact.
    const deletedTxn = cust.transactions.find(t => t.id === txnId);
    if (!deletedTxn) return;

    const delta = deletedTxn.type === 'CREDIT_PURCHASE' ? -deletedTxn.amount : deletedTxn.amount;
    const newTotalDebt = Math.max(0, (cust.totalDebt || 0) + delta);

    try {
      await updateDoc(doc(db, 'customers', customerId), {
        totalDebt: newTotalDebt,
        transactions: filteredTxns
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `customers/${customerId}`);
    }
  };

  const handleAddPurchase = async (data: Omit<PurchaseOrder, 'id'>) => {
    const id = `po-${Date.now()}`;
    const newPo: PurchaseOrder = { ...data, id };
    try {
      await setDoc(doc(db, 'purchases', id), newPo);
      alert(`Purchase Order "${newPo.poNumber}" recorded successfully!`);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `purchases/${id}`);
    }
  };

  const handleAddSupplier = async (data: Omit<Supplier, 'id' | 'totalOrders' | 'totalPaid'>) => {
    const id = `sup-${Date.now()}`;
    const newSup: Supplier = {
      ...data,
      id,
      totalOrders: 0,
      totalPaid: 0
    };
    try {
      await setDoc(doc(db, 'suppliers', id), newSup);
      alert(`Supplier "${newSup.name}" created successfully!`);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `suppliers/${id}`);
    }
  };

  const handleAddCategory = async (catName: string) => {
    const clean = catName.trim().toUpperCase();
    if (!clean) return;
    const catId = `cat-${clean.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    try {
      await setDoc(doc(db, 'categories', catId), {
        name: clean,
        createdAt: new Date().toISOString()
      });
      setCategories(prev => Array.from(new Set([...prev, clean])));
      setToast({ type: 'success', message: `Category "${clean}" added successfully!` });
    } catch (e) {
      console.error('Failed to save category to Firestore', e);
      setCategories(prev => Array.from(new Set([...prev, clean])));
      setToast({ type: 'success', message: `Category "${clean}" added!` });
    }
  };

  const handleResetDailyData = async () => {
    try {
      const resetTimestamp = Date.now();
      localStorage.setItem('talha_revenue_reset_at', resetTimestamp.toString());
      
      // Also sync to firestore if possible
      await setDoc(doc(db, 'settings', 'revenue'), {
        lastResetAt: resetTimestamp,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setToast({ type: 'success', message: "SUCCESS: Dashboard revenue counter has been reset to Rs. 0.00 for this session!" });
    } catch (err) {
      console.error("Reset revenue error:", err);
      localStorage.setItem('talha_revenue_reset_at', Date.now().toString());
      setToast({ type: 'success', message: "Dashboard revenue display reset!" });
    }
  };

  const handleWipeDatabase = async () => {
    try {
      const collectionsToClear = ['medicines', 'invoices', 'customers', 'purchases', 'suppliers'];
      for (const colName of collectionsToClear) {
        try {
          const snap = await getDocs(collection(db, colName));
          if (!snap.empty) {
            const deletePromises = snap.docs.map(docSnap => deleteDoc(doc(db, colName, docSnap.id)));
            await Promise.all(deletePromises);
          }
        } catch (colErr) {
          console.error(`Error clearing collection ${colName}:`, colErr);
        }
      }

      setMedicines([]);
      setInvoices([]);
      setCustomers([]);
      setPurchases([]);
      setSuppliers([]);
      setCart([]);
      setShift(prev => ({ ...prev, drawerCash: 0 }));
      localStorage.clear();
      setToast({ type: 'success', message: "SUCCESS: All store database records have been permanently cleared!" });
    } catch (err) {
      console.error("Master wipe error:", err);
      setMedicines([]);
      setInvoices([]);
      setCustomers([]);
      setPurchases([]);
      setSuppliers([]);
      setCart([]);
      setShift(prev => ({ ...prev, drawerCash: 0 }));
      setToast({ type: 'success', message: "Store records cleared successfully!" });
    }
  };

  const handlePrint = (inv: Invoice) => {
    setPrintingInvoice(inv);
  };

  const handleCompleteSale = async (
    shouldPrint: boolean = true,
    saleDetails?: {
      customerName?: string;
      customerPhone?: string;
      customerCnic?: string;
      paymentMethod?: 'CASH' | 'CREDIT / A/R' | 'VISA CARD';
      discountAmount?: number;
      taxRate?: number;
      netTotal?: number;
    }
  ) => {
    if (cart.length === 0) return;
    const totalAmount = saleDetails?.netTotal ?? cart.reduce((acc, item) => acc + (item.medicine.retailPrice * item.quantity), 0);
    const custName = saleDetails?.customerName?.trim() || 'Walk-in Customer';
    const invId = `inv-${Date.now()}`;
    const newInv: Invoice = {
      id: invId,
      invoiceNumber: `#INV-${Math.floor(90000 + Math.random() * 10000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: custName,
      customerType: custName.toLowerCase().includes('walk-in') ? 'Retail Customer' : 'Registered Khata Customer',
      doctor: 'Dr. A. Rahman (PMC-4912)',
      items: cart.map(i => ({ name: i.medicine.name, strength: i.medicine.sku, qty: i.quantity, price: i.medicine.retailPrice })),
      totalAmount,
      paymentMethod: saleDetails?.paymentMethod || 'CASH',
      cashier: shift.pharmacistName,
      status: 'COMPLETED'
    };

    try {
      await setDoc(doc(db, 'invoices', invId), newInv);

      for (const item of cart) {
        const updatedStock = Math.max(0, item.medicine.stock - item.quantity);
        await updateDoc(doc(db, 'medicines', item.medicine.id), { stock: updatedStock });
      }

      setShift(prev => ({ ...prev, drawerCash: prev.drawerCash + totalAmount }));
      setCart([]);
      
      if (shouldPrint) {
        handlePrint(newInv);
        setToast({ type: 'success', message: `Sale Completed & Saved! Invoice ${newInv.invoiceNumber} opened for printing.` });
      } else {
        setToast({ type: 'success', message: `Sale Completed & Saved to Firestore! (Invoice ${newInv.invoiceNumber})` });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `invoices/${invId}`);
    }
  };

  const [autoLocked, setAutoLocked] = useState(false);

  // 10-Minute Inactivity Auto-Lock Security Feature
  useEffect(() => {
    if (!userProfile) return;

    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('Terminal auto-locked due to 10 minutes of inactivity.');
        setAutoLocked(true);
        handleSignOut();
      }, 10 * 60 * 1000);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [userProfile]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setAutoLocked(false);
    setUserProfile(profile);
    setShift(prev => ({
      ...prev,
      pharmacistName: profile.name,
      status: profile.role
    }));
    localStorage.setItem('talha_user_session', JSON.stringify(profile));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error', e);
    }
    setUserProfile(null);
    localStorage.removeItem('talha_user_session');
  };

  if (!userProfile) {
    return <LoginView onLoginSuccess={handleLoginSuccess} expectedCredentials={credentials} autoLocked={autoLocked} />;
  }

  const alertsCount = medicines.filter(m => m.stock <= m.minStock).length;

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased print:hidden">
        {/* Sidebar with Mobile Drawer support */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          shift={shift} 
          alertsCount={alertsCount} 
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            setCurrentTab={setCurrentTab}
            onOpenQuickSale={() => setIsQuickSaleOpen(true)}
            onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            medicines={medicines}
            userProfile={userProfile}
            onSignOut={handleSignOut}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onResetDailyData={handleResetDailyData}
          />

          <main className="flex-1 overflow-y-auto">
            {currentTab === 'dashboard' && (
              <DashboardView 
                medicines={medicines} 
                invoices={invoices} 
                setCurrentTab={setCurrentTab}
                onOpenQuickSale={() => setIsQuickSaleOpen(true)}
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                onOpenEditMedicine={(med) => setEditingMedicine(med)}
                onResetDailyData={handleResetDailyData}
                onWipeDatabase={handleWipeDatabase}
                revenueResetAt={revenueResetAt}
              />
            )}

            {currentTab === 'pos' && (
              <PosView 
                medicines={medicines}
                cart={cart}
                setCart={setCart}
                onCompleteSale={handleCompleteSale}
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                shift={shift}
                categories={categories}
                onAddCategory={handleAddCategory}
                customers={customers}
              />
            )}

            {(currentTab === 'medicines' || currentTab === 'inventory') && (
              <InventoryView 
                medicines={medicines}
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                onDeleteMedicine={handleDeleteMedicine}
                onOpenEditMedicine={(med) => setEditingMedicine(med)}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'sales' && (
              <SalesView 
                invoices={invoices}
                onOpenQuickSale={() => setIsQuickSaleOpen(true)}
                onPrintInvoice={handlePrint}
                setCurrentTab={setCurrentTab}
                setToast={setToast}
              />
            )}

            {currentTab === 'customers' && (
              <CustomersKhataView 
                customers={customers}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onAddKhataTransaction={handleAddKhataTransaction}
                onDeleteCustomer={handleDeleteCustomer}
                onDeleteKhataTransaction={handleDeleteKhataTransaction}
                setCurrentTab={setCurrentTab}
                storeAddress={storeAddress}
              />
            )}

            {currentTab === 'ai-assistant' && (
              <AiAssistantView 
                medicines={medicines}
                invoices={invoices}
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'purchases' && (
              <PurchasesView 
                purchases={purchases}
                onAddPurchase={handleAddPurchase}
                medicines={medicines}
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'suppliers' && (
              <SuppliersView 
                suppliers={suppliers}
                onAddSupplier={handleAddSupplier}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView 
                invoices={invoices}
                customers={customers}
                medicines={medicines}
                setCurrentTab={setCurrentTab}
                setToast={setToast}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView 
                onWipeDatabase={handleWipeDatabase}
                onResetDailyData={handleResetDailyData}
                setCurrentTab={setCurrentTab}
                onSignOut={handleSignOut}
                expectedCredentials={credentials}
                onUpdatePassword={handleUpdatePassword}
                storeAddress={storeAddress}
                onUpdateStoreAddress={handleUpdateStoreAddress}
              />
            )}
          </main>
        </div>

        {/* Modals */}
        <QuickSaleModal 
          isOpen={isQuickSaleOpen}
          onClose={() => setIsQuickSaleOpen(false)}
          medicines={medicines}
          setCart={setCart}
          setCurrentTab={setCurrentTab}
        />

        <AddMedicineModal 
          isOpen={isAddMedicineOpen}
          onClose={() => setIsAddMedicineOpen(false)}
          onAddMedicine={handleAddMedicine}
          categories={categories}
          onAddCategory={handleAddCategory}
        />

        <EditMedicineModal 
          isOpen={!!editingMedicine}
          onClose={() => setEditingMedicine(null)}
          medicine={editingMedicine}
          onUpdateMedicine={handleUpdateMedicine}
          categories={categories}
        />

      </div>
      <PrintableInvoice 
        invoice={printingInvoice} 
        onClose={() => setPrintingInvoice(null)} 
        storeAddress={storeAddress} 
        setToast={setToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200 text-xs font-medium max-w-md">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}
    </>
  );
}

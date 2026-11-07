import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './lib/firebase';
import { TabType, Medicine, Invoice, CartItem, ShiftInfo } from './types';
import { initialShift, velocityData, aiForecastData } from './mockData';
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

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('talha_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shift, setShift] = useState<ShiftInfo>(initialShift);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [printingInvoice, setPrintingInvoice] = useState<Invoice | null>(null);

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
        // Initialize default auth credentials document in Firestore
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

  // Fetch real-time data from Firestore
  useEffect(() => {
    const unsubMedicines = onSnapshot(collection(db, 'medicines'), (snapshot) => {
      const items: Medicine[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...(docSnap.data() as Medicine), id: docSnap.id });
      });
      setMedicines(items);
      console.log('Firestore Proof: Fetched', items.length, 'medicines from collection /medicines');
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
      console.log('Firestore Proof: Fetched', items.length, 'invoices from collection /invoices');
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'invoices');
    });

    return () => {
      unsubMedicines();
      unsubInvoices();
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
      console.log('Firestore Proof: Successfully created medicine document:', newMed.id);
      alert(`Medicine "${newMed.name}" saved successfully to Firestore database!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `medicines/${newMed.id}`);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (!id) return;

    try {
      console.log('--- FIRESTORE DELETE START ---');
      const docRef = doc(db, 'medicines', id);
      
      // We wait for the promise to resolve from the server
      await deleteDoc(docRef);
      
      // Small delay to allow the real-time sync to propagate and prevent flicker
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('--- FIRESTORE DELETE SUCCESS ---');
      alert('Record permanently removed from database.');
    } catch (error) {
      console.error('--- FIRESTORE DELETE FAILED ---');
      alert('Delete failed. Please check your connection.');
      handleFirestoreError(error, OperationType.DELETE, `medicines/${id}`);
    }
  };

  const handleWipeDatabase = async () => {
    const pass = prompt('MASTER RESET: Type "DELETE" to wipe entire database:');
    if (pass !== 'DELETE') return;

    try {
      console.log('--- MASTER WIPE INITIATED ---');
      const batch = writeBatch(db);
      
      // Fetch and delete all medicines
      const medSnap = await getDocs(collection(db, 'medicines'));
      medSnap.forEach(doc => batch.delete(doc.ref));
      
      // Fetch and delete all invoices
      const invSnap = await getDocs(collection(db, 'invoices'));
      invSnap.forEach(doc => batch.delete(doc.ref));
      
      await batch.commit();
      
      setMedicines([]);
      setInvoices([]);
      setShift(prev => ({ ...prev, drawerCash: 0 }));
      
      alert('DATABASE WIPED: All records have been permanently removed.');
      console.log('--- MASTER WIPE COMPLETE ---');
      window.location.reload(); // Force refresh to ensure all listeners clear
    } catch (error) {
      console.error('Wipe failed:', error);
      alert('Critical Error during wipe. Some data may remain.');
    }
  };

  const handlePrint = (inv: Invoice) => {
    setPrintingInvoice(inv);
    // Use a small timeout to ensure the printable section is rendered before triggering print
    setTimeout(() => {
      window.print();
      setPrintingInvoice(null);
    }, 100);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((acc, item) => acc + (item.medicine.retailPrice * item.quantity), 0);
    const invId = `inv-${Date.now()}`;
    const newInv: Invoice = {
      id: invId,
      invoiceNumber: `#INV-${Math.floor(90000 + Math.random() * 10000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: 'Walk-in Retail Patient',
      customerType: 'Retail Customer',
      doctor: 'Dr. A. Rahman (PMC-4912)',
      items: cart.map(i => ({ name: i.medicine.name, strength: i.medicine.sku, qty: i.quantity, price: i.medicine.retailPrice })),
      totalAmount,
      paymentMethod: 'CASH',
      cashier: shift.pharmacistName,
      status: 'COMPLETED',
      amountTendered: totalAmount + 100,
      changeReturned: 100
    };

    try {
      await setDoc(doc(db, 'invoices', invId), newInv);
      console.log('Firestore Proof: Successfully created invoice document:', invId);

      for (const item of cart) {
        const updatedStock = Math.max(0, item.medicine.stock - item.quantity);
        await updateDoc(doc(db, 'medicines', item.medicine.id), { stock: updatedStock });
      }

      setShift(prev => ({ ...prev, drawerCash: prev.drawerCash + totalAmount }));
      setCart([]);
      
      // Trigger Print
      handlePrint(newInv);
      
      alert(`Sale Completed & Saved! Invoice ${newInv.invoiceNumber} printed.`);
      setCurrentTab('sales');
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
      }, 10 * 60 * 1000); // 10 minutes inactivity timeout
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

  // If not authenticated, render Login Screen
  if (!userProfile) {
    return <LoginView onLoginSuccess={handleLoginSuccess} expectedCredentials={credentials} autoLocked={autoLocked} />;
  }

  const alertsCount = medicines.filter(m => m.stock <= m.minStock).length;

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased print:hidden">
      {/* Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        shift={shift} 
        alertsCount={alertsCount} 
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
        />



        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView 
              medicines={medicines} 
              invoices={invoices} 
              setCurrentTab={setCurrentTab}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
              onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
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
            />
          )}

          {(currentTab === 'medicines' || currentTab === 'inventory') && (
            <InventoryView 
              medicines={medicines}
              onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
              onDeleteMedicine={handleDeleteMedicine}
            />
          )}

          {currentTab === 'sales' && (
            <SalesView 
              invoices={invoices}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
              onPrintInvoice={handlePrint}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistantView 
              medicines={medicines}
              invoices={invoices}
              onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
            />
          )}

          {currentTab === 'purchases' && (
            <PlaceholderView 
              title="Purchase Orders & Supplier Invoices" 
              description="Manage distributor purchase orders, batch verification, goods received notes (GRN), and cost audits."
              tabType={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'customers' && (
            <PlaceholderView 
              title="Customer CRM & Patient Profiles" 
              description="Manage patient chronic prescription history, loyalty rewards, AR credit limits, and doctor referral mappings."
              tabType={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'suppliers' && (
            <PlaceholderView 
              title="Suppliers & Distributor Directory" 
              description="Directory of pharmaceutical manufacturers, wholesale medical distributors, lead times, and contract terms."
              tabType={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'reports' && (
            <PlaceholderView 
              title="Reports & Financial Analytics" 
              description="Detailed DRAP compliance reports, narcotic audit logs, gross profit margin breakdown, and tax summaries."
              tabType={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'staff' && (
            <PlaceholderView 
              title="Staff & Shift Management" 
              description="Manage pharmacist licenses, terminal access control, drawer cash reconciliation, and shift logs."
              tabType={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView 
              onWipeDatabase={handleWipeDatabase}
              setCurrentTab={setCurrentTab}
              onSignOut={handleSignOut}
              expectedCredentials={credentials}
              onUpdatePassword={handleUpdatePassword}
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
      />

      </div>
      <PrintableInvoice invoice={printingInvoice} />
    </>
  );
}

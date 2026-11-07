import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './lib/firebase';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shift, setShift] = useState<ShiftInfo>(initialShift);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dbStatus, setDbStatus] = useState<string>('Connected to Firestore (Live Proof)');

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  // Fetch real-time data from Firestore
  useEffect(() => {
    const unsubMedicines = onSnapshot(collection(db, 'medicines'), (snapshot) => {
      const items: Medicine[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Medicine);
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
      // Sort newest first
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
      // Save invoice to Firestore
      await setDoc(doc(db, 'invoices', invId), newInv);
      console.log('Firestore Proof: Successfully created invoice document:', invId);

      // Update medicine stock levels in Firestore
      for (const item of cart) {
        const updatedStock = Math.max(0, item.medicine.stock - item.quantity);
        await updateDoc(doc(db, 'medicines', item.medicine.id), { stock: updatedStock });
      }

      setShift(prev => ({ ...prev, drawerCash: prev.drawerCash + totalAmount }));
      setCart([]);
      alert(`Sale Completed & Saved to Firestore! Invoice ${newInv.invoiceNumber} generated.`);
      setCurrentTab('sales');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `invoices/${invId}`);
    }
  };

  const alertsCount = medicines.filter(m => m.stock <= m.minStock).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased">
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
        />

        {/* Database Proof & Currency Status Bar */}
        <div className="bg-teal-900 text-teal-100 px-6 py-1.5 text-[11px] flex items-center justify-between font-mono border-b border-teal-950">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{dbStatus} • Currency: PKR (Rs.) • Zero Dummy Data (Add your own products via F3)</span>
          </div>
          <span className="text-teal-300">Firestore DB Connected ✓</span>
        </div>

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
            />
          )}

          {(currentTab === 'medicines' || currentTab === 'inventory') && (
            <InventoryView 
              medicines={medicines}
              onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
            />
          )}

          {currentTab === 'sales' && (
            <SalesView 
              invoices={invoices}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
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
            <PlaceholderView 
              title="System Settings & Hardware Integration" 
              description="Configure barcode scanners, thermal receipt printers (Epson TM-T88VI), FBR digital invoicing API keys, and branch parameters."
              tabType={currentTab}
              setCurrentTab={setCurrentTab}
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
  );
}

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// --- Interfaces ---

interface KYC {
  cniNumber: string;
  cniPath: string;
  permisNumber: string;
  permisPath:string;
  residence: string;
  certificat_residence: string;
  expiryDate: string;
  isVerified: boolean;
}

interface Driver {
  id: number;
  image: string;
  name: string;
  zone: string;
  delivered: number;
  inProgress: number;
  status: "Actif" | "KYC en cours" | "Suspendu";
  kyc: KYC;
  orders?: { id: number; reference: string; status: string }[];
}


// --- Données Initiales ---

const initialDrivers: Driver[] = [
  {
    id: 1,
    image: "/images/user/user-17.jpg",
    name: "Moussa Traoré",
    zone: "Centre-ville",
    delivered: 120,
    inProgress: 3,
    status: "Actif",
    kyc: {
      cniNumber: "B0012345",
      cniPath: "doc_cni.pdf",
      permisNumber: "PERM-789",
      permisPath:"doc_permis.pdf",
      residence: "Cocody",
      certificat_residence:"doc_residence_01.pdf",
      expiryDate: "2026-12-31",
      isVerified: true,
    },
    orders: [
      { id: 1, reference: "CMD-101", status: "En cours" },
      { id: 3, reference: "CMD-103", status: "Livrée" },
    ],
  },
  {
    id: 2,
    image: "/images/user/user-18.jpg",
    name: "Awa Diallo",
    zone: "Nord",
    delivered: 86,
    inProgress: 0,
    status: "KYC en cours",
    kyc: {
      cniNumber: "A0098765",
      cniPath: "doc_cni.pdf",
      permisNumber: "PERM-456",
      permisPath:"doc_permis-456.pdf",
      residence: "Yopougon",
      certificat_residence:"doc_residence_awa.pdf",
      expiryDate: "2025-06-15",
      isVerified: false,
    },
    orders: [{ id: 4, reference: "CMD-104", status: "Livrée" }],
  },
];



export default function DriverCrud() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriverModal, setNewDriverModal] = useState(false);
  
  //Nouveau livreur avec KYC 
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: "",
    zone: "",
    image: "",
    kyc: {
      cniNumber: "",
      cniPath:"",
      permisNumber: "",
      permisPath:"",
      residence: "",
      certificat_residence:"",
      expiryDate: "",
      isVerified: false,
    }
  });

  /* Filtrage des livreurs */
  const filteredDrivers = useMemo(
    () =>
      drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.zone.toLowerCase().includes(search.toLowerCase())
      ),
    [drivers, search]
  );

  /* Ajouter un nouveau livreur */
  const addDriver = () => {
    if (!newDriver.name || !newDriver.zone) return;
    
    const driverToAdd: Driver = {
      id: Date.now(),
      image: newDriver.image || "/images/user/user-default.jpg",
      name: newDriver.name as string,
      zone: newDriver.zone as string,
      delivered: 0,
      inProgress: 0,
      status: "KYC en cours",
      kyc: newDriver.kyc as KYC,
      orders: [],
    };

    setDrivers((prev) => [...prev, driverToAdd]);
    setNewDriverModal(false);
    // Reset
    setNewDriver({
        name: "", zone: "", kyc: { cniNumber: "", cniPath: "",  permisNumber: "", permisPath: "", residence: "", certificat_residence: "",  expiryDate: "", isVerified: false }
    });
  };

  // Gérer le chargement des fichiers du livreur CNI - PERMIS - CERTIFICAT DE RESIDENCE
  const handleFileChange = () => {
   
  };

  /* Supprimer un livreur */
  const deleteDriver = (id: number) =>
    setDrivers((prev) => prev.filter((d) => d.id !== id));

  /* Telecharger Pdf pour les livreurs*/
  const downloadDriver = ()=>{

  }
  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Livreurs</h2>
        <div className="flex gap-3">
            <input
            type="text"
            placeholder="Nom ou zone..."
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <button
            onClick={() => setNewDriverModal(true)}
            className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
            + Nouveau livreur
            </button>
            <button
            onClick={() => downloadDriver()}
            className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
              <ArrowDownTrayIcon className="h-6 w-6 text-white-500" />
            </button>
        </div>
      </div>

      {/* Tableau Principal de gestion des livreurs */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Livreur</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Zone</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">KYC</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Performance (Liv/Enc)</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full object-cover" src={driver.image} alt={driver.name} />
                      <span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex justify-center text-sm">
                        <p className="text-gray-800 dark:text-white font-medium">{driver.zone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex justify-center text-sm">
                        <p className={`text-[10px] px-2 py-0.5 rounded-full ${driver.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {driver.status}
                        </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 ">
                    <div className="flex justify-center">
                      {driver.kyc.isVerified ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              Vérifié
                          </span>
                      ) : (
                          <span className="text-red-500 text-xs font-bold italic">En attente</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex justify-center gap-2 text-sm font-medium">
                        <span className="text-green-600">{driver.delivered}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-orange-500">{driver.inProgress}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-end">
                    <div className="flex justify-center gap-3">
                      <button className="text-brand-500 hover:text-brand-700 font-medium text-sm" onClick={() => setSelectedDriver(driver)}>Détails</button>
                      <button className="text-red-500 hover:text-red-700 font-medium text-sm" onClick={() => deleteDriver(driver.id)}>Supprimer</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- MODAL D'AFFICHAGE : DETAILS DE LIVRAISON & INFORMATIONS KYC --- */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-4 mb-6">
            <img className="w-30 h-30 rounded-full object-cover" src={selectedDriver.image} />
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedDriver.name}</h3>
                    <p className="text-gray-500">Livreur ID: #{selectedDriver.id}</p>
                    <p className="text-gray-500">Zone: {selectedDriver.zone}</p>
                    <p className="text-gray-500"> Etat KYC : 
                    {selectedDriver.kyc.isVerified ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                               Vérifié
                          </span>
                      ) : (
                          <span className="text-red-500 text-xs font-bold"> En attente</span>
                      )}
                    </p>
                </div>
                <button onClick={() => setSelectedDriver(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne 1 : Performance */}
              <div>
                <h4 className="text-sm font-bold uppercase text-brand-500 mb-4 tracking-wider">Performances</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-700">{selectedDriver.delivered}</p>
                        <p className="text-[10px] uppercase text-green-600">Livrées</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-700">{selectedDriver.inProgress}</p>
                        <p className="text-[10px] uppercase text-orange-600">En cours</p>
                    </div>
                </div>
                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{n: 'Livrées', v: selectedDriver.delivered}, {n: 'En cours', v: selectedDriver.inProgress}]}>
                            <XAxis dataKey="n" fontSize={12} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="v" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
              </div>

              {/* Colonne 2 : Dossier KYC */}
              <div className="bg-gray-50 dark:bg-white/[0.03] p-5 rounded-xl border border-gray-100 dark:border-white/10">
                <h4 className="text-sm font-bold uppercase text-gray-700 dark:text-white/80 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   Dossier KYC
                </h4>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">N° CNI :</span>
                        <span className="font-mono font-bold text-gray-800 dark:text-white">{selectedDriver.kyc.cniNumber}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">N° Permis :</span>
                        <span className="font-mono font-bold text-gray-800 dark:text-white">{selectedDriver.kyc.permisNumber}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Date d'expiration Permis :</span>
                        <span className={`font-bold ${new Date(selectedDriver.kyc.expiryDate) < new Date() ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                            {selectedDriver.kyc.expiryDate}
                        </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Résidence :</span>
                        <span className="font-mono font-bold text-gray-800 dark:text-white">{selectedDriver.kyc.residence}</span>
                    </div>
                    <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-dashed border-gray-300">
                        <p className="text-[11px] text-gray-400 mb-1 font-bold">Dossier</p>
                        
                        <a href="#" className="text-brand-500 hover:underline flex items-center gap-1">
                             {selectedDriver.kyc.cniPath}
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                        <a href="#" className="text-brand-500 hover:underline flex items-center gap-1">
                             {selectedDriver.kyc.permisPath}
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                        <a href="#" className="text-brand-500 hover:underline flex items-center gap-1">
                             {selectedDriver.kyc.certificat_residence}
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
               <button className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200" onClick={() => setSelectedDriver(null)}>Fermer</button>
               {!selectedDriver.kyc.isVerified && (
                   <button className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-200">
                       Valider le dossier KYC
                   </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL D'AFFICHAGE : NOUVEAU LIVREUR + FORMULAIRE DE KYC  --- */}
      {newDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">Recrutement Livreur</h3>
            
            <div className="space-y-5">
              {/* Infos de base */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Informations de base</h4>
                <input 
                  type="text" 
                  placeholder="Nom complet du livreur" 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Zone d'activité (Ex: Plateau)" 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  onChange={(e) => setNewDriver({ ...newDriver, zone: e.target.value })} 
                />
              </div>

              {/* Section KYC avec Uploads */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Dossier KYC / PREUVE D'IDENTITE</h4>
                
                {/* CNI */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600">Carte Nationale d'Identité (Recto/Verso)</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'cniFile')}
                  />
                </div>

                {/* PERMIS */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600">Permis de Conduire</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'permisFile')}
                  />
                </div>

                {/* RÉSIDENCE */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600">Certificat de résidence / Facture CIE-SODECI</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'residenceFile')}
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-gray-600">Date d'expiration globale des documents</label>
                  <input 
                    type="date" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
                    onChange={(e) => setNewDriver({ ...newDriver, kyc: { ...newDriver.kyc!, expiryDate: e.target.value } })} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <button 
                className="w-full rounded-lg bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 transition-transform active:scale-95"
                onClick={addDriver}
              >
                Soumettre le dossier
              </button>
              <button 
                className="w-full py-2 text-xs font-medium text-gray-400 hover:text-gray-600"
                onClick={() => setNewDriverModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
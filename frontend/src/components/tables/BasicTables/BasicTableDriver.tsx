import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Driver {
  id: number;
  image: string;
  name: string;
  zone: string;
  delivered: number;
  inProgress: number;
  status?: "Active" | "Pending" | "Cancel | ended";
  orders?: { id: number; reference: string; status: string }[];
}

const initialDrivers: Driver[] = [
  {
    id: 1,
    image: "/images/user/user-17.jpg",
    name: "Moussa Traoré",
    zone: "Centre-ville",
    delivered: 120,
    inProgress: 3,
    teamImages: ["/images/user/user-22.jpg", "/images/user/user-23.jpg"],
    status: "Active",
    orders: [
      { id: 1, reference: "CMD-101", status: "En cours" },
      { id: 2, reference: "CMD-102", status: "En cours" },
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
    teamImages: ["/images/user/user-25.jpg"],
    status: "Pending",
    orders: [{ id: 4, reference: "CMD-104", status: "Livrée" }],
  },
];

export default function DriverCrud() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriverModal, setNewDriverModal] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({});

  /* Filtrage */
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
    setDrivers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        image: newDriver.image || "/images/user/user-default.jpg",
        name: newDriver.name,
        zone: newDriver.zone,
        delivered: 0,
        inProgress: 0,
        status: "Active",
        orders: [],
      },
    ]);
    setNewDriverModal(false);
    setNewDriver({});
  };

  /* Supprimer un livreur */
  const deleteDriver = (id: number) =>
    setDrivers((prev) => prev.filter((d) => d.id !== id));

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher un livreur..."
          className="w-64 rounded-lg border px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setNewDriverModal(true)}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm hover:bg-brand-600"
        >
          Nouveau livreur
        </button>
      </div>

      {/* Tableau TailAdmin */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Livreur
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Zone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Livrées
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  En cours
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={driver.image}
                          alt={driver.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {driver.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {driver.zone}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {driver.delivered}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {driver.inProgress}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-brand-500 hover:underline"
                        onClick={() => setSelectedDriver(driver)}
                      >
                        Détails
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => deleteDriver(driver.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDrivers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    Aucun livreur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Détails */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              {selectedDriver.name}
            </h3>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Zone :</strong> {selectedDriver.zone}</p>
              <p><strong>Commandes livrées :</strong> {selectedDriver.delivered}</p>
              <p><strong>En cours :</strong> {selectedDriver.inProgress}</p>
            </div>

            {/* Graphique efficacité */}
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Livrées", value: selectedDriver.delivered },
                    { name: "En cours", value: selectedDriver.inProgress },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Commandes en cours */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 dark:text-white">Commandes</h4>
              <ul className="mt-2 ml-4 list-disc text-sm text-gray-600 dark:text-gray-300">
                {selectedDriver.orders?.map((order) => (
                  <li key={order.id}>
                    {order.reference} - {order.status}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => setSelectedDriver(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau livreur */}
      {newDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Nouveau livreur
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom du livreur"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={newDriver.name || ""}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Zone"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={newDriver.zone || ""}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, zone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={newDriver.image || ""}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, image: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => setNewDriverModal(false)}
              >
                Annuler
              </button>
              <button
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600"
                onClick={addDriver}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

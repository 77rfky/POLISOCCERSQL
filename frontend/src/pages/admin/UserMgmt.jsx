import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaSearch } from 'react-icons/fa';
import GlassTable from '../../components/ui/GlassTable';
import PremiumInput from '../../components/ui/PremiumInput';

const mockUsers = [
  { id_pengguna: 1, nama_lengkap: 'John Doe', email: 'john@example.com', identitas: '12345678', no_whatsapp: '081234567890', role: 'User' },
  { id_pengguna: 2, nama_lengkap: 'Jane Smith', email: 'jane@example.com', identitas: '87654321', no_whatsapp: '089876543210', role: 'User' },
  { id_pengguna: 3, nama_lengkap: 'Admin User', email: 'admin@polisoccer.com', identitas: '-', no_whatsapp: '081111111111', role: 'Admin' },
];

export default function UserMgmt() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`https://polisoccersql-production.up.railway.app/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      fetchUsers();
    } catch {
      setUsers(prev => prev.filter(u => u.id_pengguna !== id));
    }
  };

  const filtered = users.filter(u =>
    u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'User',
      accessor: 'nama_lengkap',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            {row.nama_lengkap.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-white tracking-wide">{row.nama_lengkap}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'NIM / NIK', accessor: 'identitas', render: (row) => <span className="font-mono text-brand-300 bg-brand-500/10 px-2 py-1 rounded-md">{row.identitas || '-'}</span> },
    { header: 'WhatsApp', accessor: 'no_whatsapp', render: (row) => <span className="text-text-secondary">{row.no_whatsapp || '-'}</span> },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${row.role === 'Admin' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-white/10 text-text-secondary border border-white/5'}`}>
          {row.role}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => row.role !== 'Admin' ? (
        <button 
          onClick={(e) => { e.stopPropagation(); handleDelete(row.id_pengguna); }}
          className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-[0_0_10px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] group"
          title="Delete User"
        >
          <FaTrash className="group-hover:scale-110 transition-transform" />
        </button>
      ) : <span className="text-xs text-text-muted px-2">Protected</span>
    }
  ];

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-brand-300 font-medium mt-2">Manage registered members and administrators.</p>
        </div>
        <div className="w-full md:w-80">
          <PremiumInput 
            icon={FaSearch}
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <GlassTable 
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id_pengguna}
          emptyMessage="No users found matching your search."
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaTrash, FaSearch } from 'react-icons/fa';

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
      const res = await fetch('http://localhost:5001/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.length ? data : mockUsers);
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
      const res = await fetch(`http://localhost:5001/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      fetchUsers();
    } catch {
      // Remove from local state for mock
      setUsers(prev => prev.filter(u => u.id_pengguna !== id));
    }
  };

  const filtered = users.filter(u =>
    u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage all registered users.</p>
      </motion.div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">NIM/NIK</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user, idx) => (
                <tr key={user.id_pengguna} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.nama_lengkap.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{user.nama_lengkap}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{user.email}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 font-mono">{user.identitas || '-'}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{user.no_whatsapp || '-'}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.role === 'Admin' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {user.role !== 'Admin' && (
                      <button onClick={() => handleDelete(user.id_pengguna)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';

const mockPayments = [
  { id_pembayaran: 'PAY0001', id_booking: 'BK0001', nama_user: 'John Doe', bank_asal: 'BRI', nama_rekening_pengirim: 'John Doe', tgl_transfer: '2026-06-19T10:00:00Z', total_tagihan: 300000, status_verifikasi: 'Pending' },
  { id_pembayaran: 'PAY0002', id_booking: 'BK0002', nama_user: 'Jane Smith', bank_asal: 'Mandiri', nama_rekening_pengirim: 'Jane Smith', tgl_transfer: '2026-06-18T14:00:00Z', total_tagihan: 150000, status_verifikasi: 'Approved' },
];

const statusColor = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Approved': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-600',
};

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const token = localStorage.getItem('token');

  const fetchPayments = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPayments(data.length ? data : mockPayments);
    } catch {
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleVerify = async (id, status) => {
    setVerifying(id);
    try {
      const res = await fetch(`http://localhost:5001/api/payments/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status_verifikasi: status })
      });
      if (!res.ok) throw new Error();
      fetchPayments();
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Payment Verification</h1>
        <p className="text-slate-500 mt-1">Review and verify user payment proofs.</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Bank</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map(p => (
                <tr key={p.id_pembayaran} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-bold text-brand-600">{p.id_pembayaran}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-slate-700">{p.nama_user}</p>
                    <p className="text-xs text-slate-400">{p.nama_rekening_pengirim}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{p.bank_asal}</td>
                  <td className="py-4 px-6 text-sm font-semibold text-slate-700 text-right">Rp {parseInt(p.total_tagihan || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[p.status_verifikasi] || 'bg-slate-100 text-slate-600'}`}>
                      {p.status_verifikasi}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {p.status_verifikasi === 'Pending' && (
                      <div className="flex justify-center gap-2">
                        <button disabled={verifying === p.id_pembayaran} onClick={() => handleVerify(p.id_pembayaran, 'Approved')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors disabled:opacity-50">
                          <FaCheckCircle /> Approve
                        </button>
                        <button disabled={verifying === p.id_pembayaran} onClick={() => handleVerify(p.id_pembayaran, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50">
                          <FaTimesCircle /> Reject
                        </button>
                      </div>
                    )}
                    {p.bukti_transfer && (
                      <a href={`http://localhost:5001/uploads/transfer-proofs/${p.bukti_transfer}`} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors mt-1">
                        <FaEye /> View Proof
                      </a>
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
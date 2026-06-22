import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaEye, FaFileInvoiceDollar } from 'react-icons/fa';
import GlassTable from '../../components/ui/GlassTable';

const mockPayments = [
  { id_pembayaran: 'PAY0001', id_booking: 'BK0001', nama_user: 'John Doe', bank_asal: 'BRI', nama_rekening_pengirim: 'John Doe', tgl_transfer: '2026-06-19T10:00:00Z', total_tagihan: 300000, status_verifikasi: 'Pending' },
  { id_pembayaran: 'PAY0002', id_booking: 'BK0002', nama_user: 'Jane Smith', bank_asal: 'Mandiri', nama_rekening_pengirim: 'Jane Smith', tgl_transfer: '2026-06-18T14:00:00Z', total_tagihan: 150000, status_verifikasi: 'Approved' },
];

const statusStyle = {
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Approved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Rejected': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const token = localStorage.getItem('token');

  const fetchPayments = async () => {
    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPayments(data);
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
      const res = await fetch(`https://polisoccersql-production.up.railway.app/api/payments/${id}/verify`, {
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

  const columns = [
    { 
      header: 'Payment ID', 
      accessor: 'id_pembayaran',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <FaFileInvoiceDollar />
          </div>
          <div>
            <span className="font-mono font-bold text-brand-300">{row.id_pembayaran}</span>
            <p className="text-xs text-text-muted mt-0.5">Booking: {row.id_booking}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'User & Bank', 
      accessor: 'user',
      render: (row) => (
        <div>
          <p className="font-bold text-white">{row.nama_user}</p>
          <p className="text-xs text-text-secondary mt-0.5">{row.bank_asal} - {row.nama_rekening_pengirim}</p>
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'total_tagihan',
      render: (row) => <span className="font-black text-emerald-400 text-lg">Rp {parseInt(row.total_tagihan || 0).toLocaleString()}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status_verifikasi',
      render: (row) => (
        <span className={`text-xs font-black px-3 py-1.5 rounded-full border tracking-wide whitespace-nowrap ${statusStyle[row.status_verifikasi] || 'bg-white/10 text-text-secondary border-white/5'}`}>
          {row.status_verifikasi}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <div className="flex flex-col items-center gap-2">
          {row.status_verifikasi === 'Pending' && (
            <div className="flex gap-2">
              <button disabled={verifying === row.id_pembayaran} onClick={(e) => { e.stopPropagation(); handleVerify(row.id_pembayaran, 'Approved'); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <FaCheckCircle /> Approve
              </button>
              <button disabled={verifying === row.id_pembayaran} onClick={(e) => { e.stopPropagation(); handleVerify(row.id_pembayaran, 'Rejected'); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <FaTimesCircle /> Reject
              </button>
            </div>
          )}
          {row.bukti_transfer && (
            <a href={`https://polisoccersql-production.up.railway.app/uploads/transfer-proofs/${row.bukti_transfer}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white/5 text-brand-300 border border-white/10 rounded-xl text-xs font-bold hover:bg-brand-500 hover:border-transparent hover:text-white transition-all w-full">
              <FaEye /> View Proof
            </a>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Payment Verification</h1>
        <p className="text-brand-300 font-medium mt-2">Review and verify user transfer proofs.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <GlassTable 
          columns={columns}
          data={payments}
          keyExtractor={(row) => row.id_pembayaran}
          emptyMessage="No payment verifications found."
        />
      )}
    </div>
  );
}
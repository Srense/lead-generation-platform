import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const mockLeads = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+91 98765 43210', city: 'Mumbai', inquiry_type: 'support', date: '2026-07-25', status: 'New' },
    { id: 2, name: 'John Smith', email: 'john@startup.com', phone: '+91 87654 32109', city: 'Delhi', inquiry_type: 'sales', date: '2026-07-24', status: 'Contacted' },
    { id: 3, name: 'Aisha Gupta', email: 'aisha.design@agency.in', phone: '+91 76543 21098', city: 'Bangalore', inquiry_type: 'support', date: '2026-07-22', status: 'Closed' }
];

export default function LeadsViewer() {
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        if (supabase) {
            const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                // Format dates generically for UI
                setLeads(data.map(d => ({
                    ...d,
                    date: new Date(d.created_at).toLocaleDateString()
                })));
            }
        } else {
            setLeads(mockLeads);
        }
        setIsLoading(false);
    };

    const deleteLead = async (id) => {
        if (supabase) {
            await supabase.from('leads').delete().eq('id', id);
            fetchLeads();
        } else {
            setLeads(leads.filter(l => l.id !== id));
        }
    };

    const markContacted = async (id) => {
        if (supabase) {
            await supabase.from('leads').update({ status: 'Contacted' }).eq('id', id);
            fetchLeads();
        } else {
            setLeads(leads.map(l => l.id === id ? { ...l, status: 'Contacted' } : l));
        }
    };

    return (
        <div className="w-full font-sans">
            <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                            <span className="material-symbols-outlined text-xl">analytics</span>
                        </div>
                        Lead Database
                    </h2>
                    <p className="text-on-surface-variant text-sm font-sans pl-13">Manage entries captured from Contact and Sales interfaces.</p>
                </div>
                <button onClick={fetchLeads} className="text-primary p-3 hover:bg-primary/10 rounded-xl transition-all duration-300 border border-transparent hover:border-primary/20 shadow-sm hover:shadow" title="Refresh Leads">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>

            <div className="floral-glass rounded-2xl overflow-hidden ambient-shadow">
                {isLoading ? (
                    <div className="p-12 text-center text-primary font-sans font-medium flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined animate-spin">sync</span> Loading database...
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="bg-surface-variant/30 border-b border-outline-variant/60">
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Name</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Contact Info</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Inquiry Type</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40 w-full">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover-water-fill group">
                                        <td className="p-5">
                                            <div className="font-semibold text-on-surface text-sm">{lead.name}</div>
                                            <div className="text-xs text-on-surface-variant mt-1">{lead.date}</div>
                                        </td>
                                        <td className="p-5 space-y-1.5">
                                            <div className="text-sm text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">mail</span> {lead.email}</div>
                                            <div className="text-xs text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">phone</span> {lead.phone} - {lead.city}</div>
                                            {lead.message && <div className="text-xs text-on-surface-variant italic mt-2 max-w-[200px] truncate">"{lead.message}"</div>}
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full font-medium uppercase tracking-wider">{lead.inquiry_type}</span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1.5 ${lead.status === 'New' ? 'bg-error/10 text-error border border-error/20' :
                                                    lead.status === 'Contacted' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                        'bg-green-500/10 text-green-600 border border-green-500/20'
                                                }`}>
                                                <span className="w-1.5 h-1.5 rounded-full currentColor bg-current"></span>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {lead.status === 'New' && (
                                                    <button onClick={() => markContacted(lead.id)} title="Mark Contacted" className="p-2 text-primary bg-white hover:bg-primary hover:text-white rounded-lg transition-colors border border-outline-variant/60 hover:border-transparent shadow-sm">
                                                        <span className="material-symbols-outlined text-sm">done</span>
                                                    </button>
                                                )}
                                                <button onClick={() => deleteLead(lead.id)} title="Delete Lead" className="p-2 text-error bg-white hover:bg-error hover:text-white rounded-lg transition-colors border border-outline-variant/60 hover:border-transparent shadow-sm">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-on-surface-variant text-sm font-medium">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
                                                No leads match your current filter.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

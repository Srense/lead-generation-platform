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
        <div className="w-full">
            <div className="mb-8 p-6 glass-card rounded-xl border border-glass-border ambient-shadow flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-light flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        Lead Database
                    </h2>
                    <p className="text-on-surface-variant text-sm">Manage entries captured from Contact and Sales interfaces.</p>
                </div>
                <button onClick={fetchLeads} className="text-primary p-2 hover:bg-primary/10 rounded-full transition-colors" title="Refresh Leads">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>

            <div className="glass-card rounded-xl border border-glass-border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-primary">Loading database...</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container/50 border-b border-glass-border">
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Name</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Contact Info</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Inquiry Type</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Status</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border w-full">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-surface-container/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-light text-sm">{lead.name}</div>
                                            <div className="text-xs text-on-surface-variant">{lead.date}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-light flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span> {lead.email}</div>
                                            <div className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">phone</span> {lead.phone} - {lead.city}</div>
                                            {lead.message && <div className="text-xs text-on-surface-variant italic mt-1 max-w-[200px] truncate">"{lead.message}"</div>}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full font-label-caps">{lead.inquiry_type}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-label-caps ${lead.status === 'New' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-green-500/10 text-green-400 border border-green-500/20'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {lead.status === 'New' && (
                                                    <button onClick={() => markContacted(lead.id)} title="Mark Contacted" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
                                                        <span className="material-symbols-outlined text-sm">done</span>
                                                    </button>
                                                )}
                                                <button onClick={() => deleteLead(lead.id)} title="Delete Lead" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-on-surface-variant text-sm">No leads match your current filter.</td>
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

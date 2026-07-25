import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const mockContacts = [];

export default function ContactsViewer() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        if (supabase) {
            const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                setContacts(data.map(d => ({
                    ...d,
                    date: new Date(d.created_at).toLocaleDateString()
                })));
            }
        } else {
            setContacts(mockContacts);
        }
        setIsLoading(false);
    };

    const deleteContact = async (id) => {
        if (supabase) {
            await supabase.from('contacts').delete().eq('id', id);
            fetchContacts();
        } else {
            setContacts(contacts.filter(l => l.id !== id));
        }
    };

    const setStatus = async (id, status) => {
        if (supabase) {
            await supabase.from('contacts').update({ status }).eq('id', id);
            fetchContacts();
        } else {
            setContacts(contacts.map(l => l.id === id ? { ...l, status } : l));
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8 p-6 glass-card rounded-xl border border-glass-border ambient-shadow flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-light flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary">contact_support</span>
                        Contact Inquiries
                    </h2>
                    <p className="text-on-surface-variant text-sm">Manage generalized queries submitted from the Contact Us interface.</p>
                </div>
                <button onClick={fetchContacts} className="text-primary p-2 hover:bg-primary/10 rounded-full transition-colors" title="Refresh Contacts">
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
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Email</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Type & Message</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant">Status</th>
                                    <th className="p-4 text-xs font-label-caps text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border w-full">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-surface-container/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-light text-sm">{contact.name}</div>
                                            <div className="text-xs text-on-surface-variant">{contact.date}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-light flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span> {contact.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs text-on-surface-variant uppercase text-primary font-bold">{contact.inquiry_type}</div>
                                            <div className="text-sm text-slate-light max-w-sm mt-1 whitespace-pre-wrap">{contact.message}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-label-caps ${!contact.status || contact.status === 'New' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                contact.status === 'Responded' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                    'bg-green-500/10 text-green-400 border border-green-500/20'
                                                }`}>
                                                {contact.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {(!contact.status || contact.status === 'New') && (
                                                    <button onClick={() => setStatus(contact.id, 'Responded')} title="Mark Responded" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
                                                        <span className="material-symbols-outlined text-sm">done</span>
                                                    </button>
                                                )}
                                                <button onClick={() => deleteContact(contact.id)} title="Delete Message" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {contacts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-on-surface-variant text-sm">No contacts match your current filter.</td>
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

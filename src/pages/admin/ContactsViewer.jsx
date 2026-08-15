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
        <div className="w-full font-sans">
            <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                            <span className="material-symbols-outlined text-xl">contact_support</span>
                        </div>
                        Contact Inquiries
                    </h2>
                    <p className="text-on-surface-variant text-sm font-sans pl-13">Manage generalized queries submitted from the Contact Us interface.</p>
                </div>
                <button onClick={fetchContacts} className="text-primary p-3 hover:bg-primary/10 rounded-xl transition-all duration-300 border border-transparent hover:border-primary/20 shadow-sm hover:shadow" title="Refresh Contacts">
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
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Email</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Type & Message</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40 w-full">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover-water-fill group">
                                        <td className="p-5">
                                            <div className="font-semibold text-on-surface text-sm">{contact.name}</div>
                                            <div className="text-xs text-on-surface-variant mt-1">{contact.date}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">mail</span> {contact.email}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-xs text-primary uppercase font-bold tracking-wider">{contact.inquiry_type}</div>
                                            <div className="text-sm text-on-surface-variant max-w-sm mt-2 whitespace-pre-wrap leading-relaxed">{contact.message}</div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1.5 ${!contact.status || contact.status === 'New' ? 'bg-error/10 text-error border border-error/20' :
                                                contact.status === 'Responded' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                    'bg-green-500/10 text-green-600 border border-green-500/20'
                                                }`}>
                                                <span className="w-1.5 h-1.5 rounded-full currentColor bg-current"></span>
                                                {contact.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(!contact.status || contact.status === 'New') && (
                                                    <button onClick={() => setStatus(contact.id, 'Responded')} title="Mark Responded" className="p-2 text-primary bg-white hover:bg-primary hover:text-white rounded-lg transition-colors border border-outline-variant/60 hover:border-transparent shadow-sm">
                                                        <span className="material-symbols-outlined text-sm">done</span>
                                                    </button>
                                                )}
                                                <button onClick={() => deleteContact(contact.id)} title="Delete Message" className="p-2 text-error bg-white hover:bg-error hover:text-white rounded-lg transition-colors border border-outline-variant/60 hover:border-transparent shadow-sm">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {contacts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-on-surface-variant text-sm font-medium">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
                                                No contacts match your current filter.
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

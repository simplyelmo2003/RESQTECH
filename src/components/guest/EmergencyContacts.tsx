import React, { useState, useEffect } from 'react';
import { getEmergencyContacts } from '@/api/guest';
import { EmergencyContact } from '@/types/guest';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Input from '@/components/ui/Input'; // Assuming Input component
import Select from '@/components/ui/Select'; // Assuming Select component
import Button from '@/components/ui/Button'; // Assuming Button component

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await getEmergencyContacts();
        setContacts(data);
        setFilteredContacts(data); // Initialize filtered contacts
      } catch (err) {
        console.error("Failed to fetch emergency contacts:", err);
        setError("Failed to load emergency contacts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    let currentFiltered = contacts;

    // Apply search query filter
    if (searchQuery) {
      currentFiltered = currentFiltered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery)
      );
    }

    // Apply type filter
    if (filterType) {
      currentFiltered = currentFiltered.filter(contact => contact.type === filterType);
    }

    setFilteredContacts(currentFiltered);
  }, [searchQuery, filterType, contacts]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner size="md" />
        <span className="ml-2 text-dark">Loading emergency contacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  const contactTypes = Array.from(new Set(contacts.map(c => c.type))).sort().map(type => ({ value: type, label: type }));
  contactTypes.unshift({ value: '' as any, label: 'All Types' } as any); // Add an 'All' option

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          id="contact-search"
          placeholder="Search by name, org, or number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-0"
          type="search"
        />
        <Select
          id="contact-type-filter"
          options={contactTypes}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="mb-0"
          placeholder="Filter by Type"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-dark mb-1">{contact.name}</h3>
              <p className="text-sm text-gray-700">{contact.organization} ({contact.type})</p>
              <div className="flex items-center space-x-2 mt-3">
                <a href={`tel:${contact.phoneNumber}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    Call {contact.phoneNumber}
                  </Button>
                </a>
                <a href={`sms:${contact.phoneNumber}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    SMS
                  </Button>
                </a>
              </div>
              {contact.description && <p className="text-xs text-gray-500 mt-2">{contact.description}</p>}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-4">No emergency contacts found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
import React, { useEffect, useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { getBarangayAffectedPeople, createAffectedPerson, updateAffectedPerson, deleteAffectedPerson } from '@/api/barangay';
import jsPDF from 'jspdf';

interface AffectedPerson {
  id: string;
  name: string;
  sex: string;
  age: string | number;
  purok: string;
  birthday?: string;
  affected: boolean;
  evacuated: boolean;
  barangayId: string;
  barangay?: {
    id: string;
    displayName: string;
  };
}

const BarangayOfficialReports: React.FC = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState<AffectedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<AffectedPerson>>({
    name: '',
    sex: '',
    age: '',
    purok: '',
    birthday: '',
    affected: false,
    evacuated: false
  });

  const fetchPeople = useCallback(async () => {
    if (!user?.barangayId) {
      setError('No barangay assigned to this user.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log('Fetching affected people for barangayId:', user.barangayId);
      const data = await getBarangayAffectedPeople(user.barangayId);
      console.log('Fetched affected people:', data.length);
      setPeople(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch affected people:', err);
      setError('Failed to load affected people.');
    } finally {
      setLoading(false);
    }
  }, [user?.barangayId]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const handleAdd = async () => {
    if (!user?.barangayId) return;

    try {
      await createAffectedPerson({
        ...formData,
        barangayId: user.barangayId
      } as any);
      setShowAddForm(false);
      setFormData({
        name: '',
        sex: '',
        age: '',
        purok: '',
        birthday: '',
        affected: false,
        evacuated: false
      });
      fetchPeople();
    } catch (err) {
      console.error('Failed to add affected person:', err);
      setError('Failed to add affected person.');
    }
  };

  const handleEdit = (person: AffectedPerson) => {
    setEditingId(person.id);
    setFormData(person);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await updateAffectedPerson(editingId, formData);
      setEditingId(null);
      setFormData({
        name: '',
        sex: '',
        age: '',
        purok: '',
        birthday: '',
        affected: false,
        evacuated: false
      });
      fetchPeople();
    } catch (err) {
      console.error('Failed to update affected person:', err);
      setError('Failed to update affected person.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this affected person?')) return;

    try {
      await deleteAffectedPerson(id);
      fetchPeople();
    } catch (err) {
      console.error('Failed to delete affected person:', err);
      setError('Failed to delete affected person.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      sex: '',
      age: '',
      purok: '',
      birthday: '',
      affected: false,
      evacuated: false
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Get barangay name
    const barangayName = user?.barangayId?.replace('brgy-', '').replace(/-/g, ' ').toUpperCase() || 'N/A';
    
    // Set up document properties
    doc.setProperties({
      title: `Barangay ${barangayName} - Affected People Report`,
      subject: `Official Report of Affected People - Barangay ${barangayName}`,
      author: 'Barangay Emergency Response System',
      keywords: `barangay, ${barangayName}, affected, people, report`,
      creator: 'Barangay Emergency Response System'
    });

    // Header with Barangay Name
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BARANGAY AFFECTED PEOPLE REPORT', 105, 20, { align: 'center' });
    
    // Barangay Name prominently displayed
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(1, 32, 63); // Navy blue color
    doc.text(`BARANGAY ${barangayName}`, 105, 35, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Report details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Barangay: ${barangayName}`, 20, 60);
    doc.text(`Total People: ${totalPeople}`, 20, 70);
    doc.text(`Total Affected: ${totalAffected}`, 80, 70);
    doc.text(`Total Evacuated: ${totalEvacuated}`, 140, 70);

    // Table Header
    let yPosition = 90;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Draw table header background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, 170, 10, 'F');
    
    // Table headers
    const headers = ['No.', 'Name', 'Sex', 'Age', 'Purok', 'Birthday', 'Affected', 'Evacuated'];
    const columnWidths = [10, 35, 15, 15, 25, 25, 20, 25];
    let xPosition = 20;
    
    headers.forEach((header, index) => {
      doc.text(header, xPosition + 2, yPosition + 2);
      xPosition += columnWidths[index];
    });
    
    yPosition += 10;
    
    // Table data
    doc.setFont('helvetica', 'normal');
    people.forEach((person, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 25;
        
        // Repeat header on new page
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`BARANGAY ${barangayName} - AFFECTED PEOPLE REPORT (Continued)`, 105, yPosition, { align: 'center' });
        yPosition += 20;
        
        // Repeat table header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPosition - 5, 170, 10, 'F');
        
        xPosition = 20;
        headers.forEach((header, headerIndex) => {
          doc.text(header, xPosition + 2, yPosition + 2);
          xPosition += columnWidths[headerIndex];
        });
        yPosition += 10;
        doc.setFont('helvetica', 'normal');
      }
      
      // Draw row background (alternating colors)
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, yPosition - 3, 170, 8, 'F');
      }
      
      // Table data
      xPosition = 20;
      const rowData = [
        (index + 1).toString(),
        person.name || '-',
        person.sex || '-',
        person.age?.toString() || '-',
        person.purok || '-',
        person.birthday ? new Date(person.birthday).toLocaleDateString() : '-',
        person.affected ? 'Yes' : 'No',
        person.evacuated ? 'Yes' : 'No'
      ];
      
      rowData.forEach((data, dataIndex) => {
        // Truncate long text if necessary
        let displayText = data;
        if (dataIndex === 1 && data.length > 20) { // Name column
          displayText = data.substring(0, 17) + '...';
        } else if (dataIndex === 4 && data.length > 15) { // Purok column
          displayText = data.substring(0, 12) + '...';
        }
        
        doc.text(displayText, xPosition + 2, yPosition + 2);
        xPosition += columnWidths[dataIndex];
      });
      
      yPosition += 8;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Barangay ${barangayName} - Affected People Report - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text(`Generated by Barangay Emergency Response System on ${new Date().toLocaleString()}`, 105, 295, { align: 'center' });
    }
    
    // Save the PDF
    const fileName = `Barangay_${barangayName.replace(/\s+/g, '_')}_Affected_People_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (loading) return <div className="flex justify-center items-center h-48"><LoadingSpinner size="lg" /></div>;

  if (error) return (
    <Card title="Official Reports - Affected People">
      <p className="text-danger">{error}</p>
      <div className="mt-4"><Button variant="primary" onClick={fetchPeople}>Retry</Button></div>
    </Card>
  );

  const totalPeople = people.length;
  const totalAffected = people.filter(p => p.affected).length;
  const totalEvacuated = people.filter(p => p.evacuated).length;

  return (
    <Card title="Official Reports - Affected People">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm || editingId !== null}
          >
            Add Affected Person
          </Button>
          <Button
            variant="secondary"
            onClick={generatePDF}
            disabled={people.length === 0}
          >
            📄 Download PDF Report
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Total People: <strong>{totalPeople}</strong></p>
          <p>Total Affected: <strong>{totalAffected}</strong></p>
          <p>Total Evacuated: <strong>{totalEvacuated}</strong></p>
        </div>
      </div>

      {(showAddForm || editingId) && (
        <Card title={showAddForm ? "Add Affected Person" : "Edit Affected Person"} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select
                value={formData.sex || ''}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purok</label>
              <input
                type="text"
                value={formData.purok || ''}
                onChange={(e) => setFormData({ ...formData, purok: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
              <input
                type="date"
                value={formData.birthday || ''}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.affected || false}
                  onChange={(e) => setFormData({ ...formData, affected: e.target.checked })}
                  className="mr-2"
                />
                Affected
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.evacuated || false}
                  onChange={(e) => setFormData({ ...formData, evacuated: e.target.checked })}
                  className="mr-2"
                />
                Evacuated
              </label>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="primary" onClick={showAddForm ? handleAdd : handleUpdate}>
              {showAddForm ? 'Add Person' : 'Update Person'}
            </Button>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {people.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No affected people recorded yet.</p>
          <p className="text-sm text-gray-400 mt-2">Click "Add Affected Person" to start recording affected households.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded p-2 bg-white">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-xs text-gray-600">
                <th className="px-2 py-1">No.</th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Sex</th>
                <th className="px-2 py-1">Age</th>
                <th className="px-2 py-1">Purok</th>
                <th className="px-2 py-1">Birthday</th>
                <th className="px-2 py-1">Barangay</th>
                <th className="px-2 py-1">Affected</th>
                <th className="px-2 py-1">Evacuated</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={person.id} className="border-t">
                  <td className="px-2 py-1">{index + 1}</td>
                  <td className="px-2 py-1">{person.name || '-'}</td>
                  <td className="px-2 py-1">{person.sex || '-'}</td>
                  <td className="px-2 py-1">{person.age || '-'}</td>
                  <td className="px-2 py-1">{person.purok || '-'}</td>
                  <td className="px-2 py-1">{person.birthday ? new Date(person.birthday).toLocaleDateString() : '-'}</td>
                  <td className="px-2 py-1">{person.barangay?.displayName || user?.barangayId?.replace('brgy-', '').replace(/-/g, ' ').toUpperCase() || '-'}</td>
                  <td className="px-2 py-1">{person.affected ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-1">{person.evacuated ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-1">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(person)}
                        disabled={showAddForm || editingId !== null}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(person.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Button variant="outline" onClick={fetchPeople}>Refresh</Button>
      </div>
    </Card>
  );
};

export default BarangayOfficialReports;

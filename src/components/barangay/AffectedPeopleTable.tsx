import React, { useEffect, useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { getBarangayOfficialIncidentReports } from '@/api/barangay';
import type { OfficialIncidentReport } from '@/types/barangay';

const AffectedPeopleTable: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<OfficialIncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!user?.barangayId) {
      setError('No barangay assigned to this user.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getBarangayOfficialIncidentReports(user.barangayId);
      setReports(data.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()));
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch official reports:', err);
      setError('Failed to load official reports.');
    } finally {
      setLoading(false);
    }
  }, [user?.barangayId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading) return <div className="flex justify-center items-center h-48"><LoadingSpinner size="lg" /></div>;

  if (error) return (
    <div className="text-danger text-center py-8">
      <p>{error}</p>
      <div className="mt-4"><Button variant="primary" onClick={fetchReports}>Retry</Button></div>
    </div>
  );

  // Flatten all households from all reports
  const peopleList = reports.flatMap(report => 
    (report.households || []).map(household => ({
      ...household,
      birthday: household.birthday || '', // Ensure birthday is string
    }))
  );

  const totalPeople = peopleList.length;
  const totalAffected = peopleList.filter(h => h.affected).length;
  const totalEvacuated = peopleList.filter(h => h.evacuated).length;

  return (
    <div className="mt-4">
      <div className="mb-4 text-sm text-gray-600">
        <p>Total People: <strong>{totalPeople}</strong></p>
        <p>Total Affected: <strong>{totalAffected}</strong></p>
        <p>Total Evacuated: <strong>{totalEvacuated}</strong></p>
      </div>
      <div id="people-list-export" className="overflow-x-auto border rounded p-2 bg-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-gray-600">
              <th className="px-2 py-1">No.</th>
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Sex</th>
              <th className="px-2 py-1">Age</th>
              <th className="px-2 py-1">Purok</th>
              <th className="px-2 py-1">Barangay</th>
              <th className="px-2 py-1">Birthday</th>
              <th className="px-2 py-1">Affected</th>
              <th className="px-2 py-1">Evacuated</th>
            </tr>
          </thead>
          <tbody>
            {peopleList.map((person, index) => (
              <tr key={person.id || index} className="border-t">
                <td className="px-2 py-1">{index + 1}</td>
                <td className="px-2 py-1">{person.name || '-'}</td>
                <td className="px-2 py-1">{person.sex || '-'}</td>
                <td className="px-2 py-1">{person.age || '-'}</td>
                <td className="px-2 py-1">{person.purok || '-'}</td>
                <td className="px-2 py-1">{person.barangay?.displayName || '-'}</td>
                <td className="px-2 py-1">{person.birthday || '-'}</td>
                <td className="px-2 py-1">{person.affected ? 'Yes' : 'No'}</td>
                <td className="px-2 py-1">{person.evacuated ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <Button variant="outline" onClick={fetchReports}>Refresh</Button>
      </div>
    </div>
  );
};

export default AffectedPeopleTable;
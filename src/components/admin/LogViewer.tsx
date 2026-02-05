import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import { getAuditLogs } from '@/api/admin';
import { AuditLog, LogAction, LogEntityType } from '@/types/admin';
import { format } from 'date-fns';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<'' | LogAction>('');
  const [filterEntityType, setFilterEntityType] = useState<'' | LogEntityType>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // For username or entity ID search
  const { addNotification } = useNotification();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to load audit logs. Please try again.");
      addNotification({ type: 'error', message: 'Failed to fetch audit logs.' });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(log => {
    const actionMatch = filterAction === '' || log.action === filterAction;
    const entityTypeMatch = filterEntityType === '' || log.entityType === filterEntityType;
    const searchMatch = searchQuery === '' ||
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase());
    return actionMatch && entityTypeMatch && searchMatch;
  });

  const actionOptions = [{ value: '', label: 'All Actions' }, ...Object.values(LogAction).map(action => ({ value: action, label: action }))];
  const entityTypeOptions = [{ value: '', label: 'All Entity Types' }, ...Object.values(LogEntityType).map(type => ({ value: type, label: type }))];

  if (loading) {
    return (
      <Card title="Activity Log Viewer" className="min-h-[500px] flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Activity Log Viewer" className="min-h-[500px] flex justify-center items-center text-danger">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <Card title="Activity Log Viewer">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          id="log-search"
          placeholder="Search by user, entity ID, or details"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:flex-1 mb-0"
        />
        <Select
          id="filter-action"
          options={actionOptions}
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value as LogAction | '')}
          className="md:w-1/4 mb-0"
        />
        <Select
          id="filter-entity-type"
          options={entityTypeOptions}
          value={filterEntityType}
          onChange={(e) => setFilterEntityType(e.target.value as LogEntityType | '')}
          className="md:w-1/4 mb-0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary/5 border-b border-primary/10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Entity Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Entity ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-primary/2 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">
                    {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">
                    {log.username} ({log.userId})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{(log as any).purpose || ((log.details as any)?.message) || ((log.details as any)?.title) || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{log.entityType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{log.entityId}</td>
                  <td
                    className="px-6 py-4 text-sm text-dark/70 max-w-sm overflow-hidden text-ellipsis"
                    title={(() => {
                      try {
                        return JSON.stringify(log.details, null, 2);
                      } catch (e) {
                        return String((log.details as any) ?? '');
                      }
                    })()}
                  >
                    {(() => {
                      const d: any = log.details ?? {};
                      // If details is a raw string (defensive), show it
                      if (typeof d === 'string') return d.length > 200 ? d.slice(0, 200) + '…' : d;

                      // Common patterns: message/title/status
                      if (d.message) return (d.message as string).length > 200 ? (d.message as string).slice(0, 200) + '…' : d.message;
                      if (d.title) return (d.title as string).length > 200 ? (d.title as string).slice(0, 200) + '…' : d.title;
                      if (d.status) return `Status: ${d.status}`;

                      // User creation pattern: { username, role }
                      if (d.username && d.role) return `${d.username} (${d.role})`;
                      if (d.username) return d.username;

                      // Change pattern: { field, oldValue, newValue }
                      if (d.field && Object.prototype.hasOwnProperty.call(d, 'oldValue') && Object.prototype.hasOwnProperty.call(d, 'newValue')) {
                        return `${d.field}: ${String(d.oldValue)} → ${String(d.newValue)}`;
                      }

                      // If details has known fields like changes (array or object), show a short summary
                      if (d.changes) {
                        try {
                          const keys = Array.isArray(d.changes) ? d.changes.join(', ') : Object.keys(d.changes).join(', ');
                          return `Changes: ${keys}`;
                        } catch (e) {
                          // fallthrough to JSON
                        }
                      }

                      // If details is a flat object with a few primitive keys, show concise "Key: value" pairs
                      if (d && typeof d === 'object' && !Array.isArray(d)) {
                        const keys = Object.keys(d || {});
                        const simple = keys.every(k => {
                          const v = d[k];
                          return v === null || (typeof v !== 'object' && typeof v !== 'function');
                        });
                        if (simple && keys.length > 0 && keys.length <= 4) {
                          const pairs = keys.map((k) => {
                            const displayKey = k === 'ip' ? 'IP' : k;
                            return `${displayKey}: ${String(d[k])}`;
                          });
                          return pairs.join(' • ');
                        }
                      }

                      // Fallback: pretty JSON, truncated
                      try {
                        const json = JSON.stringify(d);
                        return json.length > 200 ? json.slice(0, 200) + '…' : json;
                      } catch (e) {
                        return String(d);
                      }
                    })()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-dark/50">
                  No audit logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LogViewer;
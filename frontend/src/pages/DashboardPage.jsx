import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/leaveService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsService.getDashboard(),
  });

  if (isLoading) return <LoadingSpinner />;

  const dashboard = data?.data || {};

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Employees" value={dashboard.totalEmployees || 0} color="blue" />
        <Card title="Leaves This Month" value={dashboard.totalLeaves || 0} color="green" />
        <Card title="Pending Approvals" value={dashboard.pendingApprovals || 0} color="orange" />
        <Card title="Team Coverage" value={`${dashboard.teamCoverage || 0}%`} color="purple" />
      </div>
    </div>
  );
}

export default DashboardPage;

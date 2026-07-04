import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leaveService } from '../services/leaveService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

function LeavePage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');

  const { data: balance, isLoading } = useQuery({
    queryKey: ['leaveBalance'],
    queryFn: () => leaveService.getBalance(),
  });

  const requestMutation = useMutation({
    mutationFn: () => leaveService.requestLeave(leaveTypeId, startDate, endDate, reason),
    onSuccess: () => {
      toast.success('Leave request submitted');
      setStartDate('');
      setEndDate('');
      setReason('');
      setLeaveTypeId('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to submit leave request');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const handleSubmit = (e) => {
    e.preventDefault();
    requestMutation.mutate();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Leave Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Request Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Leave Type</label>
                <select
                  value={leaveTypeId}
                  onChange={(e) => setLeaveTypeId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="1">Vacation</option>
                  <option value="2">Sick Leave</option>
                  <option value="3">Personal</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {requestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Balance</h2>
            {balance?.data?.map((item) => (
              <div key={item.id} className="mb-4 pb-4 border-b">
                <p className="font-semibold text-gray-800">{item.LeaveType?.name}</p>
                <p className="text-sm text-gray-600">Total: {item.totalBalance} days</p>
                <p className="text-sm text-gray-600">Used: {item.usedBalance} days</p>
                <p className="text-lg font-bold text-green-600">Remaining: {item.remainingBalance} days</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeavePage;

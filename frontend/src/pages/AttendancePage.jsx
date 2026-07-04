import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../services/leaveService';
import LoadingSpinner from '../components/LoadingSpinner';

function AttendancePage() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(today);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['attendance', startDate, endDate],
    queryFn: () => attendanceService.getRecords(startDate, endDate),
  });

  const checkInMutation = React.useMutation({
    mutationFn: () => attendanceService.checkIn(),
    onSuccess: () => {
      refetch();
    },
  });

  const checkOutMutation = React.useMutation({
    mutationFn: () => attendanceService.checkOut(),
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const records = data?.data || [];
  const todayRecord = records.find(r => r.checkIn?.includes(today));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Attendance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Today's Attendance</h2>
          {todayRecord ? (
            <div>
              <p className="mb-2"><span className="font-semibold">Check In:</span> {todayRecord.checkIn}</p>
              <p className="mb-4"><span className="font-semibold">Check Out:</span> {todayRecord.checkOut || 'Not checked out'}</p>
              {!todayRecord.checkOut && (
                <button
                  onClick={() => checkOutMutation.mutate()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
                >
                  Check Out
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => checkInMutation.mutate()}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            >
              Check In
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Attendance Records</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-semibold">Date</th>
              <th className="text-left py-2 px-4 font-semibold">Check In</th>
              <th className="text-left py-2 px-4 font-semibold">Check Out</th>
              <th className="text-left py-2 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{new Date(record.checkIn).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(record.checkIn).toLocaleTimeString()}</td>
                <td className="py-2 px-4">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                <td className="py-2 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendancePage;

// Global State
let currentUser = null;
let allData = {
    employees: [],
    leaveRequests: [],
    shifts: [],
    attendance: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromJSON();
    setDefaultDate();
});

// Load data from data.json
function loadDataFromJSON() {
    const defaultData = {
        employees: [
            {
                id: 1,
                name: "John Manager",
                email: "manager@company.com",
                password: "manager123",
                role: "manager",
                department: "Management",
                joinDate: "2020-01-15",
                leaveBalance: 20,
                phone: "+1-234-567-8901"
            },
            {
                id: 2,
                name: "Sarah Employee",
                email: "employee@company.com",
                password: "emp123",
                role: "employee",
                department: "Operations",
                joinDate: "2021-03-20",
                leaveBalance: 15,
                phone: "+1-234-567-8902"
            },
            {
                id: 3,
                name: "Mike Johnson",
                email: "mike@company.com",
                password: "mike123",
                role: "employee",
                department: "Operations",
                joinDate: "2021-06-10",
                leaveBalance: 16,
                phone: "+1-234-567-8903"
            },
            {
                id: 4,
                name: "Emily Davis",
                email: "emily@company.com",
                password: "emily123",
                role: "employee",
                department: "Operations",
                joinDate: "2022-01-05",
                leaveBalance: 18,
                phone: "+1-234-567-8904"
            },
            {
                id: 5,
                name: "Alex Brown",
                email: "alex@company.com",
                password: "alex123",
                role: "employee",
                department: "Operations",
                joinDate: "2022-04-12",
                leaveBalance: 14,
                phone: "+1-234-567-8905"
            }
        ],
        leaveRequests: [
            {
                id: 1,
                employeeId: 2,
                startDate: "2026-07-01",
                endDate: "2026-07-05",
                leaveType: "Annual Leave",
                reason: "Vacation",
                status: "pending",
                approvedBy: null,
                appliedDate: "2026-06-20"
            },
            {
                id: 2,
                employeeId: 3,
                startDate: "2026-07-10",
                endDate: "2026-07-10",
                leaveType: "Sick Leave",
                reason: "Medical appointment",
                status: "approved",
                approvedBy: 1,
                appliedDate: "2026-06-15"
            }
        ],
        shifts: [
            {
                id: 1,
                date: "2026-06-28",
                shiftName: "Morning Shift",
                startTime: "08:00",
                endTime: "16:00",
                assignedEmployees: [2, 3, 4],
                requiredStaff: 3,
                createdBy: 1
            },
            {
                id: 2,
                date: "2026-06-28",
                shiftName: "Evening Shift",
                startTime: "16:00",
                endTime: "00:00",
                assignedEmployees: [5],
                requiredStaff: 2,
                createdBy: 1
            },
            {
                id: 3,
                date: "2026-06-29",
                shiftName: "Morning Shift",
                startTime: "08:00",
                endTime: "16:00",
                assignedEmployees: [2, 4, 5],
                requiredStaff: 3,
                createdBy: 1
            }
        ],
        attendance: [
            {
                id: 1,
                employeeId: 2,
                date: "2026-06-26",
                status: "present",
                checkInTime: "08:15",
                checkOutTime: "17:00"
            },
            {
                id: 2,
                employeeId: 3,
                date: "2026-06-26",
                status: "present",
                checkInTime: "08:00",
                checkOutTime: "17:15"
            },
            {
                id: 3,
                employeeId: 4,
                date: "2026-06-26",
                status: "absent",
                checkInTime: null,
                checkOutTime: null
            },
            {
                id: 4,
                employeeId: 5,
                date: "2026-06-26",
                status: "present",
                checkInTime: "07:45",
                checkOutTime: "17:30"
            }
        ]
    };

    allData = defaultData;
    loadFromLocalStorage();
}

// Local Storage Management
function saveToLocalStorage() {
    localStorage.setItem('hrTrackerData', JSON.stringify(allData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('hrTrackerData');
    if (saved) {
        try {
            allData = JSON.parse(saved);
        } catch (e) {
            console.log('Using default data');
        }
    }
}

// Authentication
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = allData.employees.find(emp => emp.email === email && emp.password === password);

    if (user) {
        currentUser = user;
        showPage('dashboardPage');
        updateDashboard();
        displayUserInfo();
    } else {
        alert('Invalid email or password');
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById('loginForm').reset();
    document.getElementById('email').focus();
    showPage('loginPage');
}

function displayUserInfo() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role.toUpperCase();
}

// Page Navigation
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');

    if (pageName === 'leavePage') {
        loadLeaveRequests();
    } else if (pageName === 'shiftPage') {
        loadShifts();
    } else if (pageName === 'manpowerPage') {
        updateManpowerView();
    }
}

// Dashboard
function updateDashboard() {
    // Leave Balance
    document.getElementById('leaveBalance').textContent = currentUser.leaveBalance + ' days';
    document.getElementById('leaveBalanceDetail').textContent = currentUser.leaveBalance + ' days';

    // Welcome Message
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    document.getElementById('welcomeMsg').textContent = `${greeting}, ${currentUser.name}!`;

    // Team Size
    const teamSize = allData.employees.filter(emp => emp.role === 'employee').length;
    document.getElementById('teamSize').textContent = teamSize;

    // Upcoming Shifts
    const today = new Date().toISOString().split('T')[0];
    const upcomingShifts = allData.shifts.filter(shift => 
        shift.date >= today && shift.assignedEmployees.includes(currentUser.id)
    ).length;
    document.getElementById('upcomingShifts').textContent = upcomingShifts;

    // Manager Section
    if (currentUser.role === 'manager') {
        document.getElementById('managerSection').style.display = 'block';
        loadPendingRequests();
    } else {
        document.getElementById('managerSection').style.display = 'none';
    }

    // Attendance Status
    const today_date = new Date().toISOString().split('T')[0];
    const todayAttendance = allData.attendance.find(att => 
        att.employeeId === currentUser.id && att.date === today_date
    );
    document.getElementById('attendanceStatus').textContent = todayAttendance ? 
        (todayAttendance.status === 'present' ? 'Present' : 'Absent') : 'Not Marked';
}

// Leave Management
function showLeaveForm() {
    document.getElementById('leaveForm').style.display = 'block';
    setMinDate('startDate');
}

function hideLeaveForm() {
    document.getElementById('leaveForm').style.display = 'none';
}

function submitLeaveRequest(event) {
    event.preventDefault();
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const leaveType = document.getElementById('leaveType').value;
    const reason = document.getElementById('leaveReason').value;

    if (new Date(startDate) > new Date(endDate)) {
        alert('End date must be after start date');
        return;
    }

    const days = calculateDays(startDate, endDate);
    if (days > currentUser.leaveBalance) {
        alert('Insufficient leave balance');
        return;
    }

    const newRequest = {
        id: Math.max(...allData.leaveRequests.map(r => r.id), 0) + 1,
        employeeId: currentUser.id,
        startDate: startDate,
        endDate: endDate,
        leaveType: leaveType,
        reason: reason,
        status: 'pending',
        approvedBy: null,
        appliedDate: new Date().toISOString().split('T')[0]
    };

    allData.leaveRequests.push(newRequest);
    saveToLocalStorage();

    alert('Leave request submitted successfully!');
    hideLeaveForm();
    loadLeaveRequests();
}

function loadLeaveRequests() {
    const tbody = document.getElementById('leaveRequestsTable');
    tbody.innerHTML = '';

    const userRequests = allData.leaveRequests.filter(req => req.employeeId === currentUser.id);

    if (userRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No leave requests</td></tr>';
        return;
    }

    userRequests.forEach(request => {
        const days = calculateDays(request.startDate, request.endDate);
        const statusClass = `status-${request.status}`;
        
        tbody.innerHTML += `
            <tr>
                <td>${formatDate(request.startDate)} to ${formatDate(request.endDate)}</td>
                <td>${request.leaveType}</td>
                <td>${days} days</td>
                <td><span class="status-badge ${statusClass}">${request.status.toUpperCase()}</span></td>
                <td>${formatDate(request.appliedDate)}</td>
            </tr>
        `;
    });
}

function loadPendingRequests() {
    const tbody = document.getElementById('pendingRequestsTable');
    tbody.innerHTML = '';

    const pending = allData.leaveRequests.filter(req => req.status === 'pending');

    if (pending.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No pending requests</td></tr>';
        return;
    }

    pending.forEach(request => {
        const employee = allData.employees.find(emp => emp.id === request.employeeId);
        const days = calculateDays(request.startDate, request.endDate);
        
        tbody.innerHTML += `
            <tr>
                <td>${employee.name}</td>
                <td>${formatDate(request.startDate)} to ${formatDate(request.endDate)}</td>
                <td>${request.leaveType}</td>
                <td>${request.reason}</td>
                <td><span class="status-badge status-pending">PENDING</span></td>
                <td>
                    <button onclick="approveLeave(${request.id})" class="btn btn-small btn-success">Approve</button>
                    <button onclick="rejectLeave(${request.id})" class="btn btn-small btn-danger">Reject</button>
                </td>
            </tr>
        `;
    });
}

function approveLeave(requestId) {
    const request = allData.leaveRequests.find(r => r.id === requestId);
    request.status = 'approved';
    request.approvedBy = currentUser.id;

    const employee = allData.employees.find(emp => emp.id === request.employeeId);
    const days = calculateDays(request.startDate, request.endDate);
    employee.leaveBalance -= days;

    saveToLocalStorage();
    alert('Leave request approved!');
    loadPendingRequests();
}

function rejectLeave(requestId) {
    const request = allData.leaveRequests.find(r => r.id === requestId);
    request.status = 'rejected';
    request.approvedBy = currentUser.id;

    saveToLocalStorage();
    alert('Leave request rejected!');
    loadPendingRequests();
}

// Shift Management
function showShiftForm() {
    if (currentUser.role !== 'manager') {
        alert('Only managers can create shifts');
        return;
    }
    document.getElementById('shiftForm').style.display = 'block';
    populateEmployeeCheckboxes();
    setMinDate('shiftDate');
}

function hideShiftForm() {
    document.getElementById('shiftForm').style.display = 'none';
}

function populateEmployeeCheckboxes() {
    const container = document.getElementById('employeeCheckboxes');
    container.innerHTML = '';

    const employees = allData.employees.filter(emp => emp.role === 'employee');
    
    employees.forEach(emp => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="emp_${emp.id}" value="${emp.id}">
            <label for="emp_${emp.id}">${emp.name}</label>
        `;
        container.appendChild(div);
    });
}

function submitShift(event) {
    event.preventDefault();

    const date = document.getElementById('shiftDate').value;
    const shiftName = document.getElementById('shiftName').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const requiredStaff = parseInt(document.getElementById('requiredStaff').value);

    const checkboxes = document.querySelectorAll('#employeeCheckboxes input:checked');
    const assignedEmployees = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (assignedEmployees.length < requiredStaff) {
        alert(`Please assign at least ${requiredStaff} employees`);
        return;
    }

    const newShift = {
        id: Math.max(...allData.shifts.map(s => s.id), 0) + 1,
        date: date,
        shiftName: shiftName,
        startTime: startTime,
        endTime: endTime,
        assignedEmployees: assignedEmployees,
        requiredStaff: requiredStaff,
        createdBy: currentUser.id
    };

    allData.shifts.push(newShift);
    saveToLocalStorage();

    alert('Shift created successfully!');
    hideShiftForm();
    document.getElementById('shiftForm').reset();
    loadShifts();
}

function loadShifts() {
    const container = document.getElementById('shiftsCalendar');
    container.innerHTML = '';

    let shifts = allData.shifts;
    
    // If employee, show only their shifts
    if (currentUser.role === 'employee') {
        shifts = shifts.filter(shift => shift.assignedEmployees.includes(currentUser.id));
    }

    // Sort by date
    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (shifts.length === 0) {
        container.innerHTML = '<p>No shifts scheduled</p>';
        return;
    }

    shifts.forEach(shift => {
        const employees = shift.assignedEmployees.map(id => {
            const emp = allData.employees.find(e => e.id === id);
            return emp ? emp.name : 'Unknown';
        }).join(', ');

        const shiftDiv = document.createElement('div');
        shiftDiv.className = 'shift-card';
        shiftDiv.innerHTML = `
            <div class="shift-date">${formatDate(shift.date)}</div>
            <div class="shift-name">${shift.shiftName}</div>
            <div class="shift-time">⏰ ${shift.startTime} - ${shift.endTime}</div>
            <div class="shift-staff">Staff: ${shift.assignedEmployees.length}/${shift.requiredStaff}</div>
            <div class="shift-staff"><small>Assigned: ${employees}</small></div>
            ${currentUser.role === 'manager' ? `
                <button onclick="deleteShift(${shift.id})" class="btn btn-small btn-danger" style="width:100%;margin-top:10px;">Delete</button>
            ` : ''}
        `;
        container.appendChild(shiftDiv);
    });

    // Show create button only for managers
    if (currentUser.role === 'manager') {
        document.getElementById('createShiftBtn').style.display = 'block';
    } else {
        document.getElementById('createShiftBtn').style.display = 'none';
    }
}

function deleteShift(shiftId) {
    if (confirm('Are you sure you want to delete this shift?')) {
        allData.shifts = allData.shifts.filter(s => s.id !== shiftId);
        saveToLocalStorage();
        loadShifts();
    }
}

// Manpower Management
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('manpowerDate').value = today;
}

function updateManpowerView() {
    const selectedDate = document.getElementById('manpowerDate').value;
    updateManpowerSummary(selectedDate);
    updateManpowerTable(selectedDate);
}

function updateManpowerSummary(date) {
    let present = 0, onLeave = 0, absent = 0;

    allData.employees.forEach(emp => {
        if (emp.role === 'employee') {
            const isOnLeave = allData.leaveRequests.some(req => 
                req.employeeId === emp.id && 
                req.status === 'approved' &&
                isDateInRange(date, req.startDate, req.endDate)
            );

            if (isOnLeave) {
                onLeave++;
            } else {
                const attendance = allData.attendance.find(att => 
                    att.employeeId === emp.id && att.date === date
                );
                
                if (attendance) {
                    if (attendance.status === 'present') {
                        present++;
                    } else {
                        absent++;
                    }
                }
            }
        }
    });

    document.getElementById('presentCount').textContent = present;
    document.getElementById('onLeaveCount').textContent = onLeave;
    document.getElementById('absentCount').textContent = absent;
    document.getElementById('availableCount').textContent = present + onLeave;
}

function updateManpowerTable(date) {
    const tbody = document.getElementById('manpowerTable');
    tbody.innerHTML = '';

    const employees = allData.employees.filter(emp => emp.role === 'employee');

    employees.forEach(emp => {
        const isOnLeave = allData.leaveRequests.some(req => 
            req.employeeId === emp.id && 
            req.status === 'approved' &&
            isDateInRange(date, req.startDate, req.endDate)
        );

        let status = 'Absent';
        let statusClass = 'status-absent';

        if (isOnLeave) {
            status = 'On Leave';
            statusClass = 'status-pending';
        } else {
            const attendance = allData.attendance.find(att => 
                att.employeeId === emp.id && att.date === date
            );
            
            if (attendance) {
                status = attendance.status === 'present' ? 'Present' : 'Absent';
                statusClass = attendance.status === 'present' ? 'status-present' : 'status-absent';
            }
        }

        const shift = allData.shifts.find(s => 
            s.date === date && s.assignedEmployees.includes(emp.id)
        );

        const shiftName = shift ? shift.shiftName : '-';

        tbody.innerHTML += `
            <tr>
                <td><strong>${emp.name}</strong></td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${shiftName}</td>
                <td>${emp.department}</td>
            </tr>
        `;
    });
}

// Attendance
function markAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const existing = allData.attendance.find(att => 
        att.employeeId === currentUser.id && att.date === today
    );

    if (existing) {
        alert('Attendance already marked for today');
        return;
    }

    const checkInTime = new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    const newAttendance = {
        id: Math.max(...allData.attendance.map(a => a.id), 0) + 1,
        employeeId: currentUser.id,
        date: today,
        status: 'present',
        checkInTime: checkInTime,
        checkOutTime: null
    };

    allData.attendance.push(newAttendance);
    saveToLocalStorage();

    alert('Attendance marked successfully!');
    updateDashboard();
}

// Utility Functions
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', options);
}

function isDateInRange(date, startDate, endDate) {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
}

function setMinDate(inputId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(inputId).min = today;
    if (!document.getElementById(inputId).value) {
        document.getElementById(inputId).value = today;
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    setDefaultDate();
});

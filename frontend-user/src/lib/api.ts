const API_URL = 'http://127.0.0.1:5000/api';

// ── Types ──────────────────────────────────────────────────
export interface Room {
    catalog_id: string;
    room_id: string;
    room_name: string;
    capacity: number;
    location: string;
    amenities: string;
    status: string;
    floor_no: number;
    room_number: string;
    availability: string;
}

export interface Booking {
    booking_id: string;
    catalog_id: string;
    room_id: string;
    uid: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    purpose: string;
    status: string;
    // joined fields
    room_name?: string;
    location?: string;
    floor_no?: number;
    user_name?: string;
    email?: string;
}

export interface User {
    uid: string;
    name: string;
    email: string;
    dept: string;
    phone_no: string;
    userrole_id: string;
}

// ── Helpers ────────────────────────────────────────────────
const getToken = (): string | null => localStorage.getItem('token');

const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Auth ───────────────────────────────────────────────────
export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
};

export const registerUser = async (payload: {
    uid: string; name: string; email: string;
    password: string; dept: string; phone_no: string; userrole_id?: string;
}) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
    }
    return res.json();
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
};

// ── Rooms ──────────────────────────────────────────────────
export const fetchRooms = async (): Promise<Room[]> => {
    const res = await fetch(`${API_URL}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
};

export const fetchRoom = async (catalog_id: string, room_id: string): Promise<Room> => {
    const res = await fetch(`${API_URL}/rooms/${catalog_id}/${room_id}`);
    if (!res.ok) throw new Error('Failed to fetch room');
    return res.json();
};

// ── Bookings ───────────────────────────────────────────────
export const createBooking = async (data: {
    uid: string; catalog_id: string; room_id: string;
    start_date: string; end_date: string;
    start_time: string; end_time: string; purpose?: string;
}): Promise<{ message: string; booking_id: string }> => {
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create booking');
    }
    return res.json();
};

export const fetchUserBookings = async (uid: string): Promise<Booking[]> => {
    const res = await fetch(`${API_URL}/bookings/user/${uid}`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your bookings');
    return res.json();
};

export const cancelBooking = async (booking_id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/bookings/${booking_id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to cancel booking');
    }
    return res.json();
};

// ── Users ──────────────────────────────────────────────────
export const fetchUserProfile = async (uid: string): Promise<User> => {
    const res = await fetch(`${API_URL}/users/${uid}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
};

export const updateUserProfile = async (uid: string, data: { name: string; dept: string; phone_no: string }) => {
    const res = await fetch(`${API_URL}/users/${uid}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
};

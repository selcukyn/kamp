import { CalendarEvent, Department, IpAccessConfig, User, AppNotification, ActivityLog } from './types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'İstek başarısız oldu');
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function loadBootstrap() {
  const data = await request('/bootstrap');
  return {
    events: (data.events as any[]).map(event => ({ ...event, date: new Date(event.date) } as CalendarEvent)),
    users: data.users as User[],
    departments: data.departments as Department[],
    ipConfig: data.ipConfig as IpAccessConfig,
    notifications: (data.notifications as any[]).map(n => ({ ...n, date: new Date(n.date) } as AppNotification)),
    logs: (data.logs as any[]).map(l => ({ ...l, timestamp: new Date(l.timestamp) } as ActivityLog)),
  };
}

export async function createUser(name: string, email: string, emoji: string) {
  return request('/users', { method: 'POST', body: JSON.stringify({ name, email, emoji }) }) as Promise<User>;
}

export async function deleteUser(id: string) {
  await request(`/users/${id}`, { method: 'DELETE' });
}

export async function createDepartment(name: string) {
  return request('/departments', { method: 'POST', body: JSON.stringify({ name }) }) as Promise<Department>;
}

export async function deleteDepartment(id: string) {
  await request(`/departments/${id}`, { method: 'DELETE' });
}

export async function updateIpConfig(config: IpAccessConfig) {
  return request('/ip-config', { method: 'PUT', body: JSON.stringify(config) }) as Promise<IpAccessConfig>;
}

export async function createEvent(event: Omit<CalendarEvent, 'id'>) {
  const payload = { ...event, date: (event.date as Date).toISOString() };
  const result = await request('/events', { method: 'POST', body: JSON.stringify(payload) });
  return {
    event: { ...result.event, date: new Date(result.event.date) } as CalendarEvent,
    notification: result.notification ? { ...result.notification, date: new Date(result.notification.date) } as AppNotification : null,
    log: result.log ? { ...result.log, timestamp: new Date(result.log.timestamp) } as ActivityLog : null,
  };
}

export async function deleteEvent(id: string) {
  await request(`/events/${id}`, { method: 'DELETE' });
}

export async function deleteAllEvents() {
  await request('/events', { method: 'DELETE' });
}

export async function fetchNotifications() {
  const data = await request('/notifications');
  return (data as any[]).map(n => ({ ...n, date: new Date(n.date) } as AppNotification));
}

export async function fetchLogs() {
  const data = await request('/logs');
  return (data as any[]).map(l => ({ ...l, timestamp: new Date(l.timestamp) } as ActivityLog));
}

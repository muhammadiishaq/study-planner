import API_BASE_URL from '../config/api';

// Schedule Service - Production Ready (Backend handles email/name)

class ScheduleService {
  constructor() {
    this.STORAGE_KEY = 'alnafi_schedule';
    this.PENDING_KEY = 'alnafi_schedule_pending';
    this.LAST_SYNC_KEY = 'alnafi_schedule_last_sync';
  }

  // ==================== LOCAL STORAGE METHODS ====================

  getFromLocal() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { sessions: [], goals: null };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { sessions: [], goals: null };
    }
  }

  saveToLocal(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getPendingSessions() {
    try {
      const data = localStorage.getItem(this.PENDING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  addToPending(session) {
    const pending = this.getPendingSessions();
    pending.push({ ...session, pendingSync: true });
    localStorage.setItem(this.PENDING_KEY, JSON.stringify(pending));
  }

  clearPending() {
    localStorage.removeItem(this.PENDING_KEY);
  }

  getLastSyncTime() {
    return localStorage.getItem(this.LAST_SYNC_KEY);
  }

  setLastSyncTime() {
    localStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());
  }

  // ==================== SESSION METHODS ====================

  async createSession(sessionData) {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { success: false, message: 'Please login first' };
      }

      const user = JSON.parse(userStr);
      
      // ✅ SIMPLE: Just send userId, backend handles email/name
      console.log('📤 Creating session for userId:', user.id);
      
      const session = {
        ...sessionData,
        userId: user.id,
        id: Date.now().toString(),
        status: 'not_started',
        actualHours: 0,
        createdAt: new Date().toISOString()
      };

      const localData = this.getFromLocal();
      localData.sessions.push(session);
      this.saveToLocal(localData);

      try {
        const response = await fetch(`${API_BASE_URL.schedule}/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...sessionData, 
            userId: user.id
            // ✅ NO email/name sent - backend gets it from database!
          })
        });

        const data = await response.json();

        if (data.success) {
          console.log('✅ Session created! Backend added email:', data.data.studentEmail);
          
          const index = localData.sessions.findIndex(s => s.id === session.id);
          if (index !== -1) {
            localData.sessions[index] = { ...session, ...data.data };
            this.saveToLocal(localData);
          }
          this.setLastSyncTime();
          return { success: true, data: data.data, synced: true };
        } else {
          this.addToPending(session);
          return { success: true, data: session, synced: false, offline: true };
        }
      } catch (error) {
        this.addToPending(session);
        return { success: true, data: session, synced: false, offline: true };
      }

    } catch (error) {
      console.error('Create session error:', error);
      return { success: false, message: error.message };
    }
  }

  async getSessions(startDate = null, endDate = null) {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { success: false, message: 'Please login first' };
      }

      const user = JSON.parse(userStr);
      const localData = this.getFromLocal();
      let sessions = localData.sessions;

      if (startDate && endDate) {
        sessions = sessions.filter(s => {
          const sessionDate = new Date(s.date);
          return sessionDate >= new Date(startDate) && sessionDate <= new Date(endDate);
        });
      }

      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await fetch(
          `${API_BASE_URL.schedule}/sessions/${user.id}?${queryParams}`
        );

        const data = await response.json();

        if (data.success) {
          const merged = this.mergeSessions(localData.sessions, data.data);
          localData.sessions = merged;
          this.saveToLocal(localData);
          this.setLastSyncTime();

          return { success: true, sessions: merged, synced: true };
        }
      } catch (error) {
        console.log('Backend unavailable, using local data');
      }

      return { success: true, sessions, synced: false };

    } catch (error) {
      console.error('Get sessions error:', error);
      return { success: false, message: error.message };
    }
  }

  async getTodaySessions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.getSessions(today.toISOString(), tomorrow.toISOString());
  }

  async updateSession(sessionId, updateData) {
    try {
      const localData = this.getFromLocal();
      const index = localData.sessions.findIndex(s => s._id === sessionId || s.id === sessionId);

      if (index === -1) {
        return { success: false, message: 'Session not found' };
      }

      localData.sessions[index] = {
        ...localData.sessions[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocal(localData);

      try {
        const response = await fetch(`${API_BASE_URL.schedule}/sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (data.success) {
          localData.sessions[index] = data.data;
          this.saveToLocal(localData);
          return { success: true, data: data.data, synced: true };
        }
      } catch (error) {
        this.addToPending({ ...localData.sessions[index], action: 'update' });
      }

      return { success: true, data: localData.sessions[index], synced: false };

    } catch (error) {
      console.error('Update session error:', error);
      return { success: false, message: error.message };
    }
  }

  async deleteSession(sessionId) {
    try {
      const localData = this.getFromLocal();
      localData.sessions = localData.sessions.filter(s => s._id !== sessionId && s.id !== sessionId);
      this.saveToLocal(localData);

      try {
        await fetch(`${API_BASE_URL.schedule}/sessions/${sessionId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.log('Backend delete failed, will sync later');
      }

      return { success: true };

    } catch (error) {
      console.error('Delete session error:', error);
      return { success: false, message: error.message };
    }
  }

  async stopTimer(sessionId) {
    try {
      const localData = this.getFromLocal();
      const session = localData.sessions.find(s => s._id === sessionId || s.id === sessionId);

      if (!session || !session.timerStartedAt) {
        return { success: false, message: 'Timer not started' };
      }

      const now = new Date();
      const startTime = new Date(session.timerStartedAt);
      const diffMs = now - startTime;
      const diffHours = diffMs / (1000 * 60 * 60);

      const updateData = {
        status: 'completed',
        actualHours: Math.round(diffHours * 100) / 100,
        timerStoppedAt: now.toISOString()
      };

      try {
        const response = await fetch(`${API_BASE_URL.schedule}/sessions/${sessionId}/stop-timer`, {
          method: 'PUT'
        });

        const data = await response.json();

        if (data.success) {
          return await this.updateSession(sessionId, data.data);
        }
      } catch (error) {
        console.log('Backend timer stop failed, updating locally');
      }

      return await this.updateSession(sessionId, updateData);

    } catch (error) {
      console.error('Stop timer error:', error);
      return { success: false, message: error.message };
    }
  }

  // ==================== NOTIFICATIONS ====================

  async enableNotifications(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL.schedule}/sessions/${sessionId}/enable-notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        const localData = this.getFromLocal();
        const index = localData.sessions.findIndex(s => s._id === sessionId || s.id === sessionId);
        if (index !== -1) {
          localData.sessions[index].notificationsEnabled = true;
          this.saveToLocal(localData);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Enable notifications error:', error);
      return { success: false, message: error.message };
    }
  }

  async disableNotifications(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL.schedule}/sessions/${sessionId}/disable-notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        const localData = this.getFromLocal();
        const index = localData.sessions.findIndex(s => s._id === sessionId || s.id === sessionId);
        if (index !== -1) {
          localData.sessions[index].notificationsEnabled = false;
          this.saveToLocal(localData);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Disable notifications error:', error);
      return { success: false, message: error.message };
    }
  }

  // ==================== STATS & GOALS ====================

  async getWeeklyStats() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { success: false, message: 'Please login first' };
      }

      const user = JSON.parse(userStr);

      try {
        const response = await fetch(`${API_BASE_URL.schedule}/stats/${user.id}/weekly`);
        const data = await response.json();

        if (data.success) {
          return { success: true, stats: data.data, synced: true };
        }
      } catch (error) {
        console.log('Backend unavailable, calculating locally');
      }

      const localData = this.getFromLocal();
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      monday.setHours(0, 0, 0, 0);

      const weekSessions = localData.sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monday;
      });

      const plannedHours = weekSessions.reduce((sum, s) => sum + s.plannedHours, 0);
      const completedHours = weekSessions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + s.actualHours, 0);

      return {
        success: true,
        stats: {
          totalSessions: weekSessions.length,
          completedSessions: weekSessions.filter(s => s.status === 'completed').length,
          plannedHours: Math.round(plannedHours * 100) / 100,
          completedHours: Math.round(completedHours * 100) / 100,
          remainingHours: Math.round((plannedHours - completedHours) * 100) / 100,
          progressPercentage: plannedHours > 0 ? Math.round((completedHours / plannedHours) * 100) : 0
        },
        synced: false
      };

    } catch (error) {
      console.error('Get weekly stats error:', error);
      return { success: false, message: error.message };
    }
  }

  // ==================== SYNC METHODS ====================

  mergeSessions(localSessions, backendSessions) {
    const merged = [...backendSessions];
    const backendIds = new Set(backendSessions.map(s => s._id));

    localSessions.forEach(local => {
      if (!backendIds.has(local._id) && !local._id) {
        merged.push(local);
      }
    });

    return merged;
  }

  getSyncStatus() {
    const lastSync = this.getLastSyncTime();
    const pending = this.getPendingSessions();

    return {
      lastSync: lastSync ? new Date(lastSync) : null,
      pendingCount: pending.length,
      hasPending: pending.length > 0
    };
  }
}

export default new ScheduleService();
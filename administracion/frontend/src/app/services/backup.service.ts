import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface BackupInfo {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'failed' | 'in_progress';
}

export interface BackupOptions {
  type: 'full' | 'incremental';
  includeMedia?: boolean;
  compression?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  getBackups(): Observable<BackupInfo[]> {
    return this.http.get<BackupInfo[]>(`${this.API_URL}/backups`);
  }

  createBackup(options: BackupOptions): Observable<{message: string, backupId: string}> {
    return this.http.post<{message: string, backupId: string}>(`${this.API_URL}/backups`, options);
  }

  downloadBackup(backupId: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/backups/${backupId}/download`, {
      responseType: 'blob'
    });
  }

  deleteBackup(backupId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/backups/${backupId}`);
  }

  restoreBackup(backupId: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/backups/${backupId}/restore`, {});
  }

  getBackupStatus(backupId: string): Observable<{status: string, progress?: number}> {
    return this.http.get<{status: string, progress?: number}>(`${this.API_URL}/backups/${backupId}/status`);
  }

  scheduleBackup(cronExpression: string, options: BackupOptions): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/backups/schedule`, {
      cronExpression,
      ...options
    });
  }

  getScheduledBackups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/backups/scheduled`);
  }

  deleteScheduledBackup(scheduleId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/backups/scheduled/${scheduleId}`);
  }
}




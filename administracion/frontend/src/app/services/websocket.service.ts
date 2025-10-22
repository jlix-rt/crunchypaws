import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface WebSocketConnection {
  isConnected: boolean;
  lastConnected?: Date;
  lastDisconnected?: Date;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<WebSocketMessage>();
  private connectionSubject = new BehaviorSubject<WebSocketConnection>({
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  });

  private reconnectInterval: number = 5000; // 5 seconds
  private reconnectTimer: any;
  private heartbeatInterval: number = 30000; // 30 seconds
  private heartbeatTimer: any;

  constructor() {
    this.connect();
  }

  get messages$(): Observable<WebSocketMessage> {
    return this.messageSubject.asObservable();
  }

  get connection$(): Observable<WebSocketConnection> {
    return this.connectionSubject.asObservable();
  }

  get isConnected(): boolean {
    return this.connectionSubject.value.isConnected;
  }

  connect(): void {
    try {
      const wsUrl = environment.wsUrl || `ws://localhost:3001/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.updateConnectionStatus(true);
        this.startHeartbeat();
        this.clearReconnectTimer();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.messageSubject.next(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.updateConnectionStatus(false);
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.clearReconnectTimer();
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.updateConnectionStatus(false);
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  // Specific message types
  sendNotification(type: string, data: any): void {
    this.send({
      type: 'notification',
      data: { type, ...data },
      timestamp: new Date().toISOString()
    });
  }

  sendOrderUpdate(orderId: number, status: string): void {
    this.send({
      type: 'order_update',
      data: { orderId, status },
      timestamp: new Date().toISOString()
    });
  }

  sendInventoryUpdate(productId: number, quantity: number): void {
    this.send({
      type: 'inventory_update',
      data: { productId, quantity },
      timestamp: new Date().toISOString()
    });
  }

  sendUserActivity(userId: number, activity: string): void {
    this.send({
      type: 'user_activity',
      data: { userId, activity },
      timestamp: new Date().toISOString()
    });
  }

  // Subscribe to specific message types
  subscribeToType(messageType: string): Observable<WebSocketMessage> {
    return this.messages$.pipe(
      // filter(message => message.type === messageType)
    );
  }

  subscribeToNotifications(): Observable<WebSocketMessage> {
    return this.subscribeToType('notification');
  }

  subscribeToOrderUpdates(): Observable<WebSocketMessage> {
    return this.subscribeToType('order_update');
  }

  subscribeToInventoryUpdates(): Observable<WebSocketMessage> {
    return this.subscribeToType('inventory_update');
  }

  subscribeToUserActivity(): Observable<WebSocketMessage> {
    return this.subscribeToType('user_activity');
  }

  private updateConnectionStatus(isConnected: boolean): void {
    const currentStatus = this.connectionSubject.value;
    const newStatus: WebSocketConnection = {
      ...currentStatus,
      isConnected,
      lastConnected: isConnected ? new Date() : currentStatus.lastConnected,
      lastDisconnected: !isConnected ? new Date() : currentStatus.lastDisconnected,
      reconnectAttempts: isConnected ? 0 : currentStatus.reconnectAttempts
    };
    
    this.connectionSubject.next(newStatus);
  }

  private scheduleReconnect(): void {
    const currentStatus = this.connectionSubject.value;
    
    if (currentStatus.reconnectAttempts < currentStatus.maxReconnectAttempts) {
      this.reconnectTimer = setTimeout(() => {
        console.log(`Attempting to reconnect... (${currentStatus.reconnectAttempts + 1}/${currentStatus.maxReconnectAttempts})`);
        
        const newStatus = {
          ...currentStatus,
          reconnectAttempts: currentStatus.reconnectAttempts + 1
        };
        this.connectionSubject.next(newStatus);
        
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: 'ping',
          data: {},
          timestamp: new Date().toISOString()
        });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Utility methods
  getConnectionInfo(): WebSocketConnection {
    return this.connectionSubject.value;
  }

  setReconnectInterval(interval: number): void {
    this.reconnectInterval = interval;
  }

  setMaxReconnectAttempts(maxAttempts: number): void {
    const currentStatus = this.connectionSubject.value;
    this.connectionSubject.next({
      ...currentStatus,
      maxReconnectAttempts: maxAttempts
    });
  }

  // Cleanup
  ngOnDestroy(): void {
    this.disconnect();
  }
}




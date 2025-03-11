export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private initialized: boolean = false;
  private services: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  public init(): void {
    this.initialized = true;
  }

  public register(key: string, service: any): void {
    console.log('Registering service', key, this.initialized);
    if (!this.initialized) {
      throw new Error('ServiceRegistry not initialized');
    }
    this.services.set(key, service);
  }

  public get(key: string): any {
    console.log('Getting service', key, this.initialized);
    if (!this.initialized) {
      throw new Error('ServiceRegistry not initialized');
    }
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found`);
    }
    return service;
  }
} 
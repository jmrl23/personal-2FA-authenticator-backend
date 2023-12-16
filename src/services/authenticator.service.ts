import type { PrismaClient } from '@prisma/client';
import { CacheService } from './cache.service';
import { caching } from 'cache-manager';
import { PrismaService } from './prisma.service';
import { authenticator } from 'otplib';

export class AuthenticatorService {
  private static instance: AuthenticatorService;

  private constructor(
    private readonly cacheService: CacheService,
    private readonly prismaClient: PrismaClient,
  ) {}

  public static async createInstance(): Promise<AuthenticatorService> {
    const prismaService = PrismaService.getInstance();
    const prismaClient = prismaService.getClient();
    const instance = new AuthenticatorService(
      await CacheService.createInstance(
        caching('memory', {
          ttl: 1000 * 15,
        }),
      ),
      prismaClient,
    );

    return instance;
  }

  public static async getInstance(): Promise<AuthenticatorService> {
    if (!AuthenticatorService.instance) {
      AuthenticatorService.instance =
        await AuthenticatorService.createInstance();
    }

    return AuthenticatorService.instance;
  }

  public async create(name: string, key: string): Promise<Auth> {
    const authenticator = await this.prismaClient.authenticator.create({
      data: {
        name,
        key,
      },
    });

    const data = {
      id: authenticator.id,
      name: authenticator.name,
      code: this.generateCode(authenticator.key),
    };

    await this.resetListCache();

    return data;
  }

  public async getList(): Promise<Auth[]> {
    const cacheKey = `AuthenticatorService:getList`;
    const cache = await this.cacheService.get<Auth[]>(cacheKey);

    if (cache) return cache;

    const authenticators = await this.prismaClient.authenticator.findMany({});
    const data = authenticators.map((authenticator) => {
      const data = {
        id: authenticator.id,
        name: authenticator.name,
        code: this.generateCode(authenticator.key),
      };

      return data;
    });

    await this.cacheService.set(cacheKey, data);

    return data;
  }

  public async update(id: string, name?: string, key?: string): Promise<Auth> {
    const authenticator = await this.prismaClient.authenticator.update({
      where: {
        id,
      },
      data: {
        name,
        key,
      },
    });

    const data = {
      id: authenticator.id,
      name: authenticator.name,
      code: this.generateCode(authenticator.key),
    };

    await this.resetListCache();

    return data;
  }

  public async deleteById(id: string): Promise<Auth> {
    const authenticator = await this.prismaClient.authenticator.delete({
      where: {
        id,
      },
    });

    const data = {
      id: authenticator.id,
      name: authenticator.name,
      code: this.generateCode(authenticator.key),
    };

    return data;
  }

  private generateCode(secret: string): string {
    const code = authenticator.generate(secret);

    return code;
  }

  private async resetListCache(): Promise<void> {
    const cacheKey = `AuthenticatorService:getList`;

    await this.cacheService.del(cacheKey);
  }
}

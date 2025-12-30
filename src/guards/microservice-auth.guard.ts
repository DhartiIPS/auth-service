import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MicroserviceAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    
    const token = data.token || data.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      // Attach user to context
      data.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
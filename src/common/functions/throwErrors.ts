import { NotFoundException, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ThrowErrors {
  export function NotFound(item: string, id: number) {
    throw new NotFoundException(`${item} with id: ${id} does not found!`);
  }
  export function NotAuthorized() {
    throw new UnauthorizedException(`
    You're not authorized to do this process!!, please make sure that you're logged in then try again
    `);
  }
}

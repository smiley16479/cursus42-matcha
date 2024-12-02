import "socket.io";

declare module "socket.io" {
    interface Socket {
      /** Simplement l'id du user en db */
      user?: any;
    }
}
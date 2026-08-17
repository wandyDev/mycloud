import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SocketClientService {
  constructor(private readonly databaseService: DatabaseService) {}
  //==================================================
  //                    IS TICKET VALID
  //==================================================
  async isTicketValid(ticket: string) {
    // Busca usuarios con ticket activo y valida por hash
    const usersWithTicket = await this.databaseService.user.findMany({
      where: {
        tiket: {
          not: null,
        },
      },
    });

    let ticketDB: (typeof usersWithTicket)[number] | null = null;
    for (const user of usersWithTicket) {
      if (!user.tiket) continue;
      const isTicketOk = await bcrypt.compare(ticket, user.tiket);
      if (isTicketOk) {
        ticketDB = user;
        break;
      }
    }

    if (!ticketDB) return false;

    //Elimina el ticket
    await this.databaseService.user.update({
      where: {
        id: ticketDB.id,
      },
      data: {
        tiket: null,
      },
    });
    //Si todo esta bien
    return { isTicketValid: true, userId: ticketDB.id };
  }
}

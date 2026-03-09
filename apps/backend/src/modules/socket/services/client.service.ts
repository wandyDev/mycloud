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
    //Busca el ticket
    const ticketDB = await this.databaseService.user.findFirst({
      where: {
        tiket: ticket,
      },
    });
    //Si no encuentra el ticket
    if (!ticketDB) return false;
    //Si no coincide el ticket
    const isTicketOk = await bcrypt.compare(ticket, ticketDB.tiket);
    if (!isTicketOk) return false;

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

import HotelSysVisitor from "../generated/HotelSysVisitor.js";
export class ASTBuilder extends HotelSysVisitor {
  visitReserva(ctx) {
    return {
      cliente: ctx.campoCliente().IDENT().getText(),
      habitacion: ctx.campoHabitacion().ROOM_ID().getText(),
      fecha: ctx.campoFecha().DATE().getText(),
      noches: Number(ctx.campoNoches().INT().getText()),
      personas: Number(ctx.campoPersonas().INT().getText()),
    };
  }
}

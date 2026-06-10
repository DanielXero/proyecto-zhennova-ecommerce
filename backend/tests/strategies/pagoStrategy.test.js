  const { PagoEfectivo, PagoTarjeta, PagoTransferencia } = require('../../src/strategies/pagoStrategy');

  describe('Patrón Strategy - Métodos de pago', () => {
    const montoBase = 1000;

    test('PagoEfectivo aplica 10% de descuento', () => {
      const estrategia = new PagoEfectivo();
      expect(estrategia.calcularTotal(montoBase)).toBe(900);
    });

    test('PagoTarjeta aplica 15% de recargo', () => {
      const estrategia = new PagoTarjeta();
      expect(estrategia.calcularTotal(montoBase)).toBe(1150);
    });

    test('PagoTransferencia no aplica cambios', () => {
      const estrategia = new PagoTransferencia();
      expect(estrategia.calcularTotal(montoBase)).toBe(1000);
    });
  });
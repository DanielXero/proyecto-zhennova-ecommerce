class EstrategiaPago {
    calcularTotal(montoBase) {
        throw new Error("El método calcularTotal debe ser implementado");
    }
}


// 1. PAGO EN EFECTIVO

class PagoEfectivo extends EstrategiaPago {
   
    generarComprobanteFiscal(monto) {
        console.log(`[Efectivo] Generando factura tipo 'A' por $${monto.toFixed(2)} (IVA incluido).`);
        console.log(`[Efectivo] Número de comprobante: FACT-${Date.now()}`);
        return true;
    }

    
    actualizarLibroCaja(monto) {
        console.log(`[Efectivo] Actualizando libro de caja. Nuevo saldo: +$${monto.toFixed(2)}`);
        console.log(`[Efectivo] Movimiento registrado en contabilidad.`);
        return true;
    }

    calcularTotal(montoBase) {
        const total = montoBase * 0.90; // Aplica 10% de descuento
        console.log(`[Efectivo] Descuento del 10% aplicado. Total a pagar: $${total.toFixed(2)}`);
        
        
        this.generarComprobanteFiscal(total);
        this.actualizarLibroCaja(total);
        
        return total;
    }
}


// 2. PAGO CON TARJETA

class PagoTarjeta extends EstrategiaPago {
    
    validarDatosTarjeta() {
        console.log(`[Tarjeta] Validando número de tarjeta (16 dígitos)...`);
        console.log(`[Tarjeta] Validando CVV y fecha de expiración...`);
        console.log(`[Tarjeta] Tarjeta válida (simulación).`);
        return true;
    }

   
    conectarPasarelaPago(monto) {
        console.log(`[Tarjeta] Conectando con pasarela de pago (Stripe/PayPal simulada)...`);
        console.log(`[Tarjeta] Autorizando cobro de $${monto.toFixed(2)}...`);
        console.log(`[Tarjeta] Código de autorización: AUTH-${Math.floor(Math.random()*10000)}`);
        return true;
    }

    calcularTotal(montoBase) {
        const total = montoBase * 1.15; // Aplica 15% de recargo
        console.log(`[Tarjeta] Recargo del 15% aplicado. Total a pagar: $${total.toFixed(2)}`);
        
        
        this.validarDatosTarjeta();
        this.conectarPasarelaPago(total);
        
        return total;
    }
}


// 3. PAGO POR TRANSFERENCIA

class PagoTransferencia extends EstrategiaPago {
    
    generarOrdenTransferencia(monto) {
        console.log(`[Transferencia] Generando orden de transferencia bancaria...`);
        console.log(`[Transferencia] CBU: 1234567890123456789012`);
        console.log(`[Transferencia] Alias: ZHENNOVA.PAGO`);
        console.log(`[Transferencia] Monto a transferir: $${monto.toFixed(2)}`);
        return true;
    }

    
    enviarOrdenAlBanco() {
        console.log(`[Transferencia] Enviando orden al banco (API simulada)...`);
        console.log(`[Transferencia] Orden enviada. ID de transacción: TRANSF-${Date.now()}`);
        console.log(`[Transferencia] Esperando confirmación del banco...`);
        return true;
    }

    calcularTotal(montoBase) {
        const total = montoBase; 
        console.log(`[Transferencia] Sin recargo. Total a pagar: $${total.toFixed(2)}`);
        
       
        this.generarOrdenTransferencia(total);
        this.enviarOrdenAlBanco();
        
        return total;
    }
}

module.exports = {
    PagoEfectivo,
    PagoTarjeta,
    PagoTransferencia
};
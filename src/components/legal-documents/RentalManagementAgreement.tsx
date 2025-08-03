import React from 'react';

export const RentalManagementAgreement: React.FC = () => {
  return (
    <div className="bg-white text-black font-serif leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-green-600 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-green-600">CONTRATO DE ADMINISTRACIÓN</h1>
        <div className="text-lg mt-2">OAXACA PROPERTY SOLUTIONS</div>
        <div className="text-base mt-1">Servicios Profesionales de Gestión Inmobiliaria</div>
      </div>

      {/* Company Information */}
      <div className="mb-6">
        <div className="bg-green-50 p-4 border-l-4 border-green-500">
          <h2 className="font-bold text-green-700 mb-2">EMPRESA ADMINISTRADORA</h2>
          <div className="space-y-1 text-sm">
            <div><strong>Razón Social:</strong> Oaxaca Property Solutions, S.A. de C.V.</div>
            <div><strong>RFC:</strong> OPS-190815-A47</div>
            <div><strong>Domicilio:</strong> Av. Benito Juárez 456, Col. Centro, Puerto Escondido, Oaxaca</div>
            <div><strong>Teléfono:</strong> +52 (954) 123-4567</div>
            <div><strong>Email:</strong> info@oaxacapropertysolutions.com</div>
            <div><strong>Licencia:</strong> LI-2019-OAX-0892 (PROFECO)</div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-green-600 mb-3">PROPIEDAD BAJO ADMINISTRACIÓN</h2>
        <div className="bg-gray-50 p-4 space-y-2">
          <div><strong>Nombre:</strong> Villa Mazunte - Beachfront Paradise</div>
          <div><strong>Ubicación:</strong> Playa Mazunte, Santa María Tonameca, Oaxaca</div>
          <div><strong>Tipo:</strong> Villa de lujo frente al mar</div>
          <div><strong>Capacidad:</strong> 8 huéspedes, 4 recámaras, 3.5 baños</div>
          <div><strong>Amenidades:</strong> Piscina privada, acceso directo a playa, cocina gourmet</div>
          <div><strong>Propietario:</strong> Ancient Holdings Ltd.</div>
        </div>
      </div>

      {/* Management Services */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-green-600 mb-3">SERVICIOS DE ADMINISTRACIÓN</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-700 mb-2">GESTIÓN DE RESERVACIONES</h3>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Manejo de calendarios en múltiples plataformas (Airbnb, Booking.com, VRBO)</li>
              <li>Atención al cliente 24/7 en español e inglés</li>
              <li>Proceso de check-in y check-out</li>
              <li>Gestión de precios dinámicos según temporada</li>
              <li>Marketing digital y fotografía profesional</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-700 mb-2">MANTENIMIENTO Y LIMPIEZA</h3>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Limpieza profunda entre huéspedes (3 horas)</li>
              <li>Mantenimiento preventivo mensual</li>
              <li>Jardinería y mantenimiento de piscina</li>
              <li>Reparaciones menores (hasta $200 USD sin autorización)</li>
              <li>Inspecciones semanales de la propiedad</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 border-l-4 border-purple-500">
            <h3 className="font-bold text-purple-700 mb-2">SERVICIOS ADICIONALES</h3>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Gestión de emergencias 24/7</li>
              <li>Coordinación con servicios locales (tours, transporte)</li>
              <li>Reabastecimiento de amenidades</li>
              <li>Reportes financieros mensuales</li>
              <li>Seguro de responsabilidad civil incluido</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Financial Terms */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-green-600 mb-3">TÉRMINOS FINANCIEROS</h2>
        
        <div className="bg-green-50 p-4 border border-green-200">
          <h3 className="font-bold text-green-700 mb-2">ESTRUCTURA DE COMISIONES</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div><strong>Comisión de Administración:</strong> 10% de ingresos brutos</div>
              <div><strong>Comisión de Limpieza:</strong> $45 USD por limpieza</div>
              <div><strong>Comisión de Mantenimiento:</strong> 5% de ingresos brutos</div>
            </div>
            <div>
              <div><strong>Renta Mensual Proyectada:</strong> $10,250 USD</div>
              <div><strong>Comisión Mensual:</strong> $1,025 USD</div>
              <div><strong>Ingresos Netos al Propietario:</strong> $9,225 USD</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 mt-4">
          <h3 className="font-bold mb-2">CALENDARIO DE PAGOS</h3>
          <div className="text-sm space-y-1">
            <div><strong>Frecuencia:</strong> Transferencias mensuales al propietario</div>
            <div><strong>Fecha de Pago:</strong> 15 de cada mes</div>
            <div><strong>Método:</strong> Transferencia bancaria internacional</div>
            <div><strong>Moneda:</strong> Dólares Americanos (USD)</div>
            <div><strong>Cuenta Destino:</strong> Ancient Holdings Ltd. - Nevis</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-green-600 mb-3">MÉTRICAS DE DESEMPEÑO</h2>
        
        <div className="bg-blue-50 p-4">
          <h3 className="font-bold text-blue-700 mb-2">OBJETIVOS DE OCUPACIÓN</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div><strong>Temporada Alta:</strong></div>
              <div>(Dic-Abr): 85% ocupación</div>
            </div>
            <div>
              <div><strong>Temporada Media:</strong></div>
              <div>(Nov, May): 65% ocupación</div>
            </div>
            <div>
              <div><strong>Temporada Baja:</strong></div>
              <div>(Jun-Oct): 45% ocupación</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 mt-4">
          <h3 className="font-bold text-yellow-700 mb-2">ESTÁNDARES DE CALIDAD</h3>
          <div className="text-sm space-y-1">
            <div>• <strong>Rating Mínimo:</strong> 4.7/5.0 en todas las plataformas</div>
            <div>• <strong>Tiempo de Respuesta:</strong> Máximo 1 hora durante horario de oficina</div>
            <div>• <strong>Tiempo de Limpieza:</strong> Máximo 4 horas entre huéspedes</div>
            <div>• <strong>Disponibilidad:</strong> 99% del tiempo (excluyendo mantenimiento programado)</div>
          </div>
        </div>
      </div>

      {/* Legal Terms */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-green-600 mb-3">TÉRMINOS LEGALES</h2>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong>Duración del Contrato:</strong> 12 meses renovables automáticamente
          </div>
          <div>
            <strong>Terminación:</strong> Cualquier parte puede terminar con 60 días de aviso previo
          </div>
          <div>
            <strong>Seguro:</strong> OPS mantiene seguro de responsabilidad civil por $100,000 USD
          </div>
          <div>
            <strong>Legislación Aplicable:</strong> Leyes del Estado de Oaxaca, México
          </div>
          <div>
            <strong>Resolución de Disputas:</strong> Arbitraje en Puerto Escondido, Oaxaca
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-green-600 mb-3">CONTACTOS CLAVE</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3">
            <div className="font-bold">GERENTE GENERAL</div>
            <div>Ing. Roberto Salinas</div>
            <div>Cel: +52 (954) 567-8901</div>
            <div>Email: roberto@oaxacapropertysolutions.com</div>
          </div>
          <div className="bg-gray-50 p-3">
            <div className="font-bold">SUPERVISOR DE LIMPIEZA</div>
            <div>Sra. Carmen López</div>
            <div>Cel: +52 (954) 345-6789</div>
            <div>Email: limpieza@oaxacapropertysolutions.com</div>
          </div>
          <div className="bg-gray-50 p-3">
            <div className="font-bold">ATENCIÓN AL CLIENTE</div>
            <div>Lic. María Fernanda Cruz</div>
            <div>Cel: +52 (954) 234-5678</div>
            <div>Email: atencion@oaxacapropertysolutions.com</div>
          </div>
          <div className="bg-gray-50 p-3">
            <div className="font-bold">MANTENIMIENTO</div>
            <div>Téc. José Luis Ramírez</div>
            <div>Cel: +52 (954) 456-7890</div>
            <div>Email: mantenimiento@oaxacapropertysolutions.com</div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-8 grid grid-cols-2 gap-8 border-t-2 border-green-600 pt-6">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">OAXACA PROPERTY SOLUTIONS</p>
            <p className="text-sm">Ing. Roberto Salinas</p>
            <p className="text-sm">Gerente General</p>
            <div className="mt-4 text-xs italic">Firma Autorizada</div>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">ANCIENT HOLDINGS LTD.</p>
            <p className="text-sm">Michael Thompson</p>
            <p className="text-sm">Director</p>
            <div className="mt-4 text-xs italic">Firma del Propietario</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-600 border-t pt-4">
        <p>Contrato firmado en Puerto Escondido, Oaxaca el 01 de Noviembre de 2024</p>
        <p>Oaxaca Property Solutions | RFC: OPS-190815-A47 | www.oaxacapropertysolutions.com</p>
      </div>
    </div>
  );
};
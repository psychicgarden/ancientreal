import React from 'react';

export const InsurancePolicy: React.FC = () => {
  return (
    <div className="bg-white text-black font-serif leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-red-600 pb-6 mb-6">
        <div className="text-2xl font-bold text-red-600">SEGUROS AZTECA</div>
        <div className="text-lg mt-2">COMPAÑÍA DE SEGUROS, S.A. DE C.V.</div>
        <div className="text-base mt-1">Póliza de Seguro de Propiedad</div>
        <div className="mt-4 w-16 h-16 mx-auto border-2 border-red-600 rounded-full flex items-center justify-center">
          <div className="text-xs text-center font-bold text-red-600">
            <div>AZTECA</div>
            <div>SEGUROS</div>
          </div>
        </div>
      </div>

      {/* Policy Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center text-red-600 mb-4">PÓLIZA DE SEGURO MÚLTIPLE</h2>
        <div className="bg-red-50 border-2 border-red-200 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Número de Póliza:</strong> AZ-2024-PRO-7891</div>
            <div><strong>Vigencia:</strong> Del 01/11/2024 al 01/11/2025</div>
            <div><strong>Moneda:</strong> Dólares Americanos (USD)</div>
            <div><strong>Forma de Pago:</strong> Anual Anticipada</div>
          </div>
        </div>
      </div>

      {/* Insured Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">DATOS DEL ASEGURADO</h3>
        <div className="ml-4 space-y-2">
          <div><strong>Asegurado:</strong> Ancient Holdings Ltd.</div>
          <div><strong>Domicilio:</strong> Suite 1, A.L. Evelyn Building, Charlestown, Nevis</div>
          <div><strong>Actividad:</strong> Inversión Inmobiliaria</div>
          <div><strong>RFC/Tax ID:</strong> AHL-241015-N34</div>
        </div>
      </div>

      {/* Property Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">BIEN ASEGURADO</h3>
        <div className="bg-gray-50 p-4 space-y-2">
          <div><strong>Ubicación:</strong> Playa Mazunte, Santa María Tonameca, Oaxaca, México</div>
          <div><strong>Tipo de Propiedad:</strong> Villa de Playa / Desarrollo Turístico</div>
          <div><strong>Superficie:</strong> 2,500 metros cuadrados</div>
          <div><strong>Construcción:</strong> 450 metros cuadrados</div>
          <div><strong>Año de Construcción:</strong> 2024 (Nueva Construcción)</div>
          <div><strong>Uso:</strong> Residencial / Turístico / Renta Vacacional</div>
        </div>
      </div>

      {/* Coverage Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">COBERTURAS Y SUMAS ASEGURADAS</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-700 mb-2">COBERTURA BÁSICA</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Incendio y Rayo:</strong> $150,000 USD</div>
              <div><strong>Explosión:</strong> $150,000 USD</div>
              <div><strong>Daños por Agua:</strong> $75,000 USD</div>
              <div><strong>Robo con Violencia:</strong> $25,000 USD</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 border-l-4 border-green-500">
            <h4 className="font-bold text-green-700 mb-2">FENÓMENOS NATURALES</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Huracán y Ciclón:</strong> $150,000 USD</div>
              <div><strong>Inundación:</strong> $100,000 USD</div>
              <div><strong>Terremoto:</strong> $150,000 USD</div>
              <div><strong>Maremoto/Tsunami:</strong> $100,000 USD</div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-700 mb-2">RESPONSABILIDAD CIVIL</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Daños a Terceros:</strong> $50,000 USD</div>
              <div><strong>Responsabilidad Patronal:</strong> $25,000 USD</div>
              <div><strong>Huéspedes/Visitantes:</strong> $30,000 USD</div>
              <div><strong>Defensa Legal:</strong> $10,000 USD</div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-700 mb-2">COBERTURAS ADICIONALES</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Pérdida de Rentas:</strong> $20,000 USD</div>
              <div><strong>Gastos Extraordinarios:</strong> $15,000 USD</div>
              <div><strong>Remoción de Escombros:</strong> $10,000 USD</div>
              <div><strong>Honorarios de Arquitectos:</strong> $8,000 USD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deductibles */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">DEDUCIBLES</h3>
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Incendio/Explosión/Rayo:</strong> $500 USD o 1%</div>
            <div><strong>Fenómenos Naturales:</strong> $2,500 USD o 2%</div>
            <div><strong>Daños por Agua:</strong> $1,000 USD o 1%</div>
            <div><strong>Robo:</strong> $1,500 USD o 5%</div>
          </div>
        </div>
      </div>

      {/* Premium Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">INFORMACIÓN DE PRIMA</h3>
        <div className="bg-red-50 p-4 border border-red-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm space-y-1">
                <div><strong>Prima Neta:</strong> $2,850.00 USD</div>
                <div><strong>Gastos de Expedición:</strong> $75.00 USD</div>
                <div><strong>IVA (16%):</strong> $468.00 USD</div>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-right">
                <div>PRIMA TOTAL:</div>
                <div className="text-red-600">$3,393.00 USD</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">CONDICIONES IMPORTANTES</h3>
        <div className="text-sm space-y-2 ml-4">
          <div>• <strong>Aviso de Siniestro:</strong> Máximo 5 días hábiles</div>
          <div>• <strong>Inspecciones:</strong> La aseguradora se reserva el derecho de inspeccionar</div>
          <div>• <strong>Actualización de Valores:</strong> Anual conforme al INPC</div>
          <div>• <strong>Jurisdicción:</strong> Tribunales competentes en Ciudad de México</div>
          <div>• <strong>Moneda de Pago:</strong> Los siniestros se pagarán en USD o equivalente en MXN</div>
        </div>
      </div>

      {/* Claims Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 mb-3">INFORMACIÓN PARA SINIESTROS</h3>
        <div className="bg-yellow-50 p-4 border border-yellow-300">
          <div className="text-sm space-y-2">
            <div><strong>Teléfono de Emergencia 24/7:</strong> +52 (55) 5123-4567</div>
            <div><strong>Email de Siniestros:</strong> siniestros@segurosAzteca.com.mx</div>
            <div><strong>Portal Web:</strong> www.segurosAzteca.com.mx/siniestros</div>
            <div><strong>Ajustador Asignado:</strong> Ing. Carlos Ramírez Soto</div>
            <div><strong>Teléfono Ajustador:</strong> +52 (951) 567-8901</div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-8 grid grid-cols-2 gap-8 border-t-2 border-red-600 pt-6">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">SEGUROS AZTECA</p>
            <p className="text-sm">Lic. Ana María Rodríguez</p>
            <p className="text-sm">Directora de Suscripción</p>
            <div className="mt-4 text-xs italic">Firma Autorizada</div>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">CONTRATANTE</p>
            <p className="text-sm">Ancient Holdings Ltd.</p>
            <p className="text-sm">Por: Michael Thompson</p>
            <div className="mt-4 text-xs italic">Firma del Asegurado</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-600 border-t pt-4">
        <p>Póliza expedida en la Ciudad de México el 01 de Noviembre de 2024</p>
        <p>Seguros Azteca, S.A. de C.V. | Registro CNSF: S-0123 | www.segurosAzteca.com.mx</p>
      </div>
    </div>
  );
};
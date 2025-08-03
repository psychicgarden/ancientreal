import React from 'react';

export const MexicanPropertyDeed: React.FC = () => {
  return (
    <div className="bg-white text-black font-serif leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <div className="text-xl font-bold">REPÚBLICA MEXICANA</div>
        <div className="text-lg">ESTADO DE OAXACA</div>
        <div className="text-base font-semibold mt-2">ESCRITURA PÚBLICA</div>
        <div className="text-sm">No. 1,247</div>
      </div>

      {/* Official Seal Area */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-20 h-20 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs text-center">
          <div>
            <div className="font-bold">SELLO</div>
            <div>NOTARIAL</div>
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold">NOTARÍA PÚBLICA No. 3</div>
          <div>Puerto Escondido, Oaxaca</div>
          <div className="text-sm mt-1">Lic. María Elena Vásquez Morales</div>
          <div className="text-sm">Notario Público</div>
        </div>
        <div className="w-20 h-20 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs text-center">
          <div>
            <div className="font-bold">REGISTRO</div>
            <div>PÚBLICO</div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="space-y-4 text-justify">
        <h2 className="text-lg font-bold text-center">COMPRAVENTA DE INMUEBLE</h2>
        
        <p>
          <strong>FECHA:</strong> Veintiocho de noviembre del año dos mil veinticuatro, en la ciudad de Puerto Escondido, Oaxaca, México.
        </p>

        <p>
          <strong>COMPARECIENTES:</strong>
        </p>

        <div className="ml-4">
          <p><strong>VENDEDOR:</strong> José Antonio Méndez Rivera, mexicano, mayor de edad, con domicilio en Calle Benito Juárez No. 123, Mazunte, Oaxaca.</p>
          <p><strong>COMPRADOR:</strong> Ancient Holdings Ltd., sociedad constituida bajo las leyes de Nevis, representada por su Director General.</p>
        </div>

        <h3 className="font-bold">DESCRIPCIÓN DEL INMUEBLE</h3>
        <div className="ml-4 space-y-2">
          <p><strong>Ubicación:</strong> Playa Mazunte, Santa María Tonameca, Oaxaca, México</p>
          <p><strong>Superficie:</strong> 2,500 metros cuadrados</p>
          <p><strong>Colindancias:</strong></p>
          <ul className="ml-6 list-disc">
            <li>Al Norte: Con propiedad de la familia García, 50 metros</li>
            <li>Al Sur: Con Océano Pacífico, 50 metros</li>
            <li>Al Este: Con camino vecinal, 50 metros</li>
            <li>Al Oeste: Con propiedad ejidal, 50 metros</li>
          </ul>
          <p><strong>Clave Catastral:</strong> 203-001-045-000</p>
          <p><strong>Folio Real:</strong> 20456</p>
        </div>

        <h3 className="font-bold">PRECIO Y FORMA DE PAGO</h3>
        <p className="ml-4">
          El precio de la operación es la cantidad de <strong>$750,000.00 USD</strong> (SETECIENTOS CINCUENTA MIL DÓLARES AMERICANOS 00/100), 
          pagaderos mediante transferencia bancaria internacional.
        </p>

        <h3 className="font-bold">ANTECEDENTES DE PROPIEDAD</h3>
        <p className="ml-4">
          El inmueble objeto de esta escritura fue adquirido por el señor José Antonio Méndez Rivera mediante 
          Escritura Pública No. 892 de fecha 15 de marzo de 2018, otorgada ante la fe del Notario Público No. 3 
          de Puerto Escondido, Oaxaca.
        </p>

        <h3 className="font-bold">CERTIFICACIONES</h3>
        <div className="ml-4 space-y-1">
          <p>✓ Certificado de Libertad de Gravamen</p>
          <p>✓ Certificado de No Adeudo Predial</p>
          <p>✓ Uso de Suelo autorizado para desarrollo turístico</p>
          <p>✓ Manifestación de Impacto Ambiental aprobada</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">VENDEDOR</p>
            <p>José Antonio Méndez Rivera</p>
            <div className="mt-4 text-xs italic">Firma autógrafa</div>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">COMPRADOR</p>
            <p>Ancient Holdings Ltd.</p>
            <p className="text-sm">Por: Director General</p>
            <div className="mt-4 text-xs italic">Firma autógrafa</div>
          </div>
        </div>
      </div>

      {/* Notary Certification */}
      <div className="mt-8 border-t-2 border-gray-400 pt-4">
        <div className="text-center">
          <p className="font-bold">CERTIFICACIÓN NOTARIAL</p>
          <p className="text-sm mt-2">
            DOY FE que la presente escritura fue leída íntegramente a los otorgantes, quienes manifestaron 
            su conformidad y la firmaron en mi presencia el día de hoy.
          </p>
          <div className="mt-6">
            <p className="font-bold">Lic. María Elena Vásquez Morales</p>
            <p>Notario Público No. 3</p>
            <p>Puerto Escondido, Oaxaca</p>
            <div className="mt-4 text-xs italic">Sello y firma notarial</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-600 border-t pt-4">
        <p>Registrada en el Registro Público de la Propiedad y del Comercio de Oaxaca</p>
        <p>Libro: 1,245 | Sección: I | Volumen: 892 | Partida: 1,247 | Fecha: 28/11/2024</p>
      </div>
    </div>
  );
};
import React, { useRef } from "react";
import { exportarBackup, importarBackup } from "../services/backupService";

// A tipagem explícita JSX.Element foi removida para resolver o erro de namespace.
// O TypeScript inferirá o tipo de retorno corretamente.
export default function BackupPanel() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>): void => {
    importarBackup(e);
    // Reseta o input para permitir importar o mesmo arquivo novamente
    if (e.target) {
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-[#0f4fa8] mb-2">
        💾 Backup de Dados
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Salve todos os seus dados em um arquivo no celular. Use o backup para não
        perder informações ao trocar de dispositivo ou limpar o navegador.
      </p>

      {/* Seção de Exportar */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">📥 Salvar Backup</h4>
        <button
          onClick={exportarBackup}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Baixar Backup no Celular (.json)
        </button>
        <p className="text-xs text-gray-400 mt-1">
          Recomendado: faça backup toda semana ou após muitas vendas.
        </p>
      </div>

      {/* Separador */}
      <hr className="my-4 border-gray-200" />

      {/* Seção de Importar */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">📤 Restaurar Backup</h4>
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-3 bg-[#0f4fa8] hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
        >
          Selecionar Arquivo de Backup
        </button>
        <p className="text-xs text-gray-400 mt-1">
          ⚠️ Isso substituirá todos os dados atuais pelos dados do backup.
        </p>

        {/* Input oculto para seleção de arquivo */}
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImportar}
        />
      </div>

      {/* Rodapé informativo */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-600 text-center">
          🔒 Seus dados ficam salvos apenas neste dispositivo.
          Nenhuma informação é enviada para a internet.
        </p>
      </div>
    </div>
  );
}

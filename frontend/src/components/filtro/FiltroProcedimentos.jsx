import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function FiltroProcedimentos({ atividades, selecionarAtividades }) {
  const [procedimentos, setProcedimentos] = useState([]);
  const [tiposSelecionados, setTiposSelecionados] = useState([]);

  useEffect(() => {
    // Fetch procedimentos do banco de dados
    fetch("http://localhost:3003/sistema/procedimentos")
      .then((response) => response.json())
      .then((data) => setProcedimentos(data))
      .catch((error) => console.error("Erro ao buscar procedimentos:", error));
  }, []);

  const toggleTipo = (tipo) => {
    setTiposSelecionados((prevTiposSelecionados) =>
      prevTiposSelecionados.includes(tipo)
        ? prevTiposSelecionados.filter((t) => t !== tipo)
        : [...prevTiposSelecionados, tipo]
    );
  };

  useEffect(() => {
    if (tiposSelecionados.length === 0) {
      selecionarAtividades(atividades);
    } else {
      const eventsFilter = atividades.filter((atividade) =>
        tiposSelecionados.includes(atividade?.procedimento?.procedimento)
      );
      selecionarAtividades(eventsFilter);
    }
  }, [tiposSelecionados, atividades]);

  return (
    procedimentos.length > 0 && (
      <div
        className="p-3 rounded border border-white mt-3"
        style={{ backgroundColor: "#E9ECEF", color: "#212529", margin: "20px" }}
      >
        <div>
          <h5 style={{ marginBottom: "15px" }}>Filtro por Procedimentos</h5>
        </div>
        <div className="ps-1" style={{ maxHeight: "25vh", overflowY: "auto" }}>
          {procedimentos.map((procedimento) => (
            <Form.Check
              key={procedimento.id_procedimento}
              label={procedimento.procedimento}
              checked={tiposSelecionados.includes(procedimento.procedimento)}
              onChange={() => toggleTipo(procedimento.procedimento)}
              className="mr-3 mb-3"
            />
          ))}
        </div>
        <button
          className="btn btn-outline-secondary btn-hover-gray"
          onClick={() => setTiposSelecionados([])}
        >
          Limpar Filtro
        </button>
      </div>
    )
  );
}

export default FiltroProcedimentos;

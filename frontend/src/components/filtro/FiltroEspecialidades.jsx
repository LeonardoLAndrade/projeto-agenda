import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function FiltroEspecialidades({ atividades, selecionarAtividades }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [tiposSelecionados, setTiposSelecionados] = useState([]);

  useEffect(() => {
    // Fetch especialidades do banco de dados
    fetch("http://localhost:3003/sistema/especialidades")
      .then((response) => response.json())
      .then((data) => {
        // Ordenar as especialidades em ordem alfabética
        const sortedEspecialidades = data.sort((a, b) =>
          a.nome_especialidade.localeCompare(b.nome_especialidade)
        );
        setEspecialidades(sortedEspecialidades);
      })
      .catch((error) => console.error("Erro ao buscar especialidades:", error));
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
        tiposSelecionados.includes(
          atividade?.procedimento?.especialidade?.nome_especialidade
        )
      );
      selecionarAtividades(eventsFilter);
    }
  }, [tiposSelecionados, atividades]);

  return (
    especialidades.length > 0 && (
      <div
        className="p-3 rounded border border-white mt-3"
        style={{ backgroundColor: "#E9ECEF", color: "#212529", margin: "20px" }}
      >
        <div>
          <h5 style={{ marginBottom: "15px" }}>Filtro por Especialidades</h5>
        </div>
        <div className="ps-1" style={{ maxHeight: "25vh", overflowY: "auto" }}>
          {especialidades.map((especialidade) => (
            <Form.Check
              key={especialidade.cod_especialidade}
              label={especialidade.nome_especialidade}
              checked={tiposSelecionados.includes(
                especialidade.nome_especialidade
              )}
              onChange={() => toggleTipo(especialidade.nome_especialidade)}
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

export default FiltroEspecialidades;

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function FiltroAtividades({ atividades, selecionarAtividades }) {
  const [profissionais, setProfissionais] = useState([]);
  const [tiposSelecionados, setTiposSelecionados] = useState([]);

  useEffect(() => {
    // Fetch profissionais do banco de dados
    fetch("http://localhost:3003/sistema/ag_profissionais")
      .then((response) => response.json())
      .then((data) => {
        // Ordenar os profissionais em ordem alfabética
        const sortedProfissionais = data.sort((a, b) =>
          a.nome_profissional.localeCompare(b.nome_profissional)
        );
        setProfissionais(sortedProfissionais);
      })
      .catch((error) => console.error("Erro ao buscar profissionais:", error));
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
          atividade?.ag_profissionai?.nome_profissional
        )
      );
      selecionarAtividades(eventsFilter);
    }
  }, [tiposSelecionados, atividades]);

  return (
    profissionais.length > 0 && (
      <div
        className="p-3 rounded border border-white mt-3"
        style={{ backgroundColor: "#E9ECEF", color: "#212529", margin: "20px" }}
      >
        <div>
          <h5 style={{ marginBottom: "15px" }}>Filtro por Profissional</h5>
        </div>
        <div className="ps-1" style={{ maxHeight: "25vh", overflowY: "auto" }}>
          {profissionais.map((profissional) => (
            <Form.Check
              key={profissional.id_profissional}
              label={profissional.nome_profissional}
              checked={tiposSelecionados.includes(
                profissional.nome_profissional
              )}
              onChange={() => toggleTipo(profissional.nome_profissional)}
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

export default FiltroAtividades;

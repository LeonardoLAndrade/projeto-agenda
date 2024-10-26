import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';

Add.propTypes = {
  onAdd: PropTypes.func.isRequired, // Verifica se `onAdd` é uma função e se é obrigatório
};


function Add({ onAdd }) {
  const [newEvent, setNewEvent] = useState({
    titulo_agenda: "",
    data_inicio: "",
    data_fim: "",
    descricao_complementar: "",
    cor: "",
    id_procedimento: "",
    id_especialidade: "",
    id_profissional: "",
    transporte: false,
    situacao: "Pendente",
  });
  const [expanded, setExpanded] = useState(true);
  const [especialidade, setEspecialidade] = useState({ value: "", text: "" });
  const [procedimento, setProcedimento] = useState({ value: "", text: "" });
  const [profissional, setProfissional] = useState({ value: "", text: "" });

  const [especialidadesData, setEspecialidadesData] = useState([]);
  const [procedimentosData, setProcedimentosData] = useState([]);
  const [profissionaisData, setProfissionaisData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3003/sistema/especialidades")
      .then((response) => response.json())
      .then((data) => setEspecialidadesData(data))
      .catch((error) => console.error("Erro ao buscar especialidades:", error)); 

    fetch("http://localhost:3003/sistema/procedimentos")
      .then((response) => response.json())
      .then((data) => setProcedimentosData(data))
      .catch((error) => console.error("Erro ao buscar procedimentos:", error));

    fetch("http://localhost:3003/sistema/profissionais")
      .then((response) => response.json())
      .then((data) => setProfissionaisData(data))
      .catch((error) => console.error("Erro ao buscar profissionais:", error));
  }, []);
 
  
  useEffect(() => {
    const generatedTitle = `${
      procedimento.text === "Procedimento"
        ? "Título gerado automaticamente"
        : procedimento.text
    } ${
      procedimento.text === "Procedimento"
        ? ""
        : procedimento.text === ""
        ? "Título gerado automaticamente"
        : "com"
    } ${
      procedimento.text === "Procedimento" || procedimento.text === ""
        ? ""
        : especialidade.text === "Especialidade"
        ? ""
        : especialidade.text
    } ${
      procedimento.text === "Procedimento" || procedimento.text === ""
        ? ""
        : especialidade.text === "Especialidade" || especialidade.text === ""
        ? ""
        : profissional.text === "Profissional Responsável" ||
          profissional.text === ""
        ? ""
        : ` - ${profissional.text}`
    } `;
    setNewEvent((prev) => ({ ...prev, titulo_agenda: generatedTitle }));
  }, [especialidade, procedimento, profissional]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setNewEvent({ ...newEvent, transporte: e.target.checked });
  };

  const handleEspecialidadeChange = (e) => {
    const value = e.currentTarget.value;
    const text = e.currentTarget.options[e.currentTarget.selectedIndex].text;
    setEspecialidade({ value, text });
    setNewEvent((prev) => ({ ...prev, id_especialidade: value }));
  };

  const handleProcedimentoChange = (e) => {
    const value = e.currentTarget.value;
    const text = e.currentTarget.options[e.currentTarget.selectedIndex].text;
    setProcedimento({ value, text });
    setNewEvent((prev) => ({ ...prev, id_procedimento: value }));
  };

  const handleProfissionalChange = (e) => {
    const value = e.currentTarget.value;
    const text = e.currentTarget.options[e.currentTarget.selectedIndex].text;
    setProfissional({ value, text });
    setNewEvent((prev) => ({ ...prev, id_profissional: value }));
  };

  const handleToggleExpanded = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedEvent = {
      ...newEvent,
      titulo_agenda: newEvent.titulo_agenda.trim(),
      descricao_complementar: newEvent.descricao_complementar.trim(),
    };

    if (
      trimmedEvent.titulo_agenda &&
      trimmedEvent.data_inicio &&
      trimmedEvent.data_fim &&
      trimmedEvent.id_especialidade &&
      trimmedEvent.id_procedimento &&
      trimmedEvent.id_profissional
    ) {
      const startDate = new Date(trimmedEvent.data_inicio);
      const endDate = new Date(trimmedEvent.data_fim);
      const today = new Date();
      const atualYear = new Date().getFullYear();

      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        toast.error("A data de início deve ser posterior ou igual a hoje.");
        return;
      }

      if (startDate >= endDate) {
        toast.error("A data de início deve ser anterior à data final.");
        return;
      }

      if (
        startDate.getFullYear() > atualYear + 20 ||
        endDate.getFullYear() > atualYear + 20
      ) {
        toast.error("As datas não podem ultrapassar o limite de 20 anos.");
        return;
      }

      fetch("http://localhost:3003/sistema/agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedEvent),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to add event");
        })
        .then((data) => {
          onAdd({
            ...trimmedEvent,
            id: data.id_agenda,
            start: startDate,
            end: endDate,
          });
          setNewEvent({
            titulo_agenda: "",
            data_inicio: "",
            data_fim: "",
            descricao_complementar: "",
            cor: "",
            id_procedimento: "",
            id_especialidade: "",
            id_profissional: "",
            transporte: false,
            situacao: "Pendente",
          });
          setEspecialidade({ value: "", text: "" });
          setProcedimento({ value: "", text: "" });
          setProfissional({ value: "", text: "" });
          toast.success("Evento adicionado com sucesso!");
        })
          
        .catch((error) => console.error("Erro ao adicionar evento.", error));
          
    }
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getMaxDateTimeLocal = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 20);
    maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());
    return maxDate.toISOString().slice(0, 16);
  };

  return (
    <div
      className="add p-3 rounded border border-white"
      style={{ backgroundColor: "#E9ECEF", color: "#212529", margin: "20px" }}
    >
      <h3>Adicionar Evento</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicTitle">
          <Form.Label>Título do Evento</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o título"
            name="titulo_agenda"
            value={newEvent.titulo_agenda}
            onChange={handleChange}
            disabled
          />
        </Form.Group>
        <Row style={{ marginTop: "20px" }}>
          <Col xs={6}>
            <Form.Select
              aria-label="especialidade"
              onChange={handleEspecialidadeChange}
              value={especialidade.value}
            >
              <option
                value=""
                style={{ backgroundColor: "#d5d5d5", color: "#5b5b5b" }}
              >
                Especialidade
              </option>
              {especialidadesData.map((especialidade) => (
                <option
                  key={especialidade.id_especialidade}
                  value={especialidade.id_especialidade}
                >
                  {especialidade.nome_especialidade}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={6}>
            <Form.Select
              aria-label="procedimento"
              onChange={handleProcedimentoChange}
              value={procedimento.value}
            >
              <option
                value=""
                style={{ backgroundColor: "#d5d5d5", color: "#5b5b5b" }}
              >
                Procedimento
              </option>
              {procedimentosData.map((procedimento) => (
                <option
                  key={procedimento.id_procedimento}
                  value={procedimento.id_procedimento}
                >
                  {procedimento.procedimento}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col xs={12}>
            <Form.Select
              aria-label="profissional"
              onChange={handleProfissionalChange}
              value={profissional.value}
            >
              <option
                value=""
                style={{ backgroundColor: "#d5d5d5", color: "#5b5b5b" }}
              >
                Profissional Responsável
              </option>
              {profissionaisData.map((profissional) => (
                <option
                  key={profissional.id_profissional}
                  value={profissional.id_profissional}
                >
                  {profissional.nome_profissional}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Form.Group controlId="formBasicStart">
              <Form.Label style={{ marginTop: "10px" }}>Início</Form.Label>
              <Form.Control
                type="datetime-local"
                name="data_inicio"
                value={newEvent.data_inicio}
                onChange={handleChange}
                min={getCurrentDateTimeLocal()}
                max={getMaxDateTimeLocal()}
              />
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group controlId="formBasicEnd">
              <Form.Label style={{ marginTop: "10px" }}>Término</Form.Label>
              <Form.Control
                type="datetime-local"
                name="data_fim"
                value={newEvent.data_fim}
                onChange={handleChange}
                min={getCurrentDateTimeLocal()}
                max={getMaxDateTimeLocal()}
              />
            </Form.Group>
          </Col>
        </Row>
        <Collapse in={expanded}>
          <div>
            <div>
              <Form.Group controlId="formBasicDesc">
                <Form.Label style={{ marginTop: "10px" }}>
                  Descrição Complementar
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Digite a descrição do evento"
                  name="descricao_complementar"
                  value={newEvent.descricao_complementar}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <Row>
              <Col>
                <Form.Label style={{ marginTop: "25px", fontSize: "18px" }}>
                  Precisa de Transporte?
                  <span
                    style={{
                      fontSize: "13px",
                      display: "block",
                      color: "rgb(133 133 133)",
                    }}
                  >
                    *Se não precisar, deixe desmarcado.
                  </span>
                </Form.Label>
                <Form.Check
                  label={"Sim, precisa."}
                  name="transporte"
                  checked={newEvent.transporte}
                  onChange={handleCheckboxChange}
                  className="mr-3 mb-3"
                />
              </Col>

              <Col xs={3}>
                <Form.Group controlId="formBasicColor">
                  <Form.Label style={{ marginTop: "25px" }}>Cor</Form.Label>
                  <Form.Control
                    type="color"
                    name="cor"
                    value={newEvent.cor || "#000000"}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Collapse>
        <Button
          variant="primary"
          type="button"
          onClick={handleToggleExpanded}
          style={{ marginTop: "10px", float: "right" }}
        >
          {expanded ? (
            <i className="bi bi-chevron-double-up"></i>
          ) : (
            <i className="bi bi-chevron-double-down"></i>
          )}
        </Button>
        <Button
          variant="success"
          type="submit"
          style={{ marginTop: "10px", marginRight: "10px" }}
          disabled={
            !newEvent.titulo_agenda ||
            !newEvent.data_inicio ||
            !newEvent.data_fim ||
            !newEvent.id_especialidade ||
            especialidade.value === "" ||
            !newEvent.id_procedimento ||
            procedimento.value === "" ||
            !newEvent.id_profissional ||
            profissional.value === ""
          }
        >
          Salvar
        </Button>
      </Form>
    </div>
  );
}

export default Add;

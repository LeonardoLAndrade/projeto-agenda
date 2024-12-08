import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Collapse, Col, Row } from "react-bootstrap";
import { FaClock, FaCheck } from "react-icons/fa";
import { toast as toastify } from "react-toastify";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

const EventModal = ({ event, onClose, onDelete, onUpdate }) => {
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const [especialidades, setEspecialidades] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const atualYear = new Date().getFullYear();
  const toast = useRef(null);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/sistema/especialidades"
        );
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Erro ao buscar especialidades:", error);
      }
    };

    const fetchProcedimentos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/sistema/procedimentos"
        );
        const data = await response.json();
        setProcedimentos(data);
      } catch (error) {
        console.error("Erro ao buscar procedimentos:", error);
      }
    };

    const fetchProfissionais = async () => {
      try {
        const response = await fetch(
          `http://localhost:3003/sistema/especialidade/${editedEvent.procedimento.cod_especialidade}/profissionais`
        );
        const data = await response.json();
        setProfissionais(
          data.sort((a, b) =>
            a.nome_profissional.localeCompare(b.nome_profissional)
          )
        );
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      }
    };

    fetchEspecialidades();
    fetchProcedimentos();
    fetchProfissionais();
  }, []);

  useEffect(() => {
    const especialidadeNome =
      editedEvent.procedimento?.especialidade?.nome_especialidade || "";
    const procedimentoNome = editedEvent.procedimento?.procedimento || "";
    const profissionalNome =
      editedEvent.profissional?.nome_profissional ||
      editedEvent.ag_profissionai?.nome_profissional;

    const generatedTitle = `${procedimentoNome} ${
      especialidadeNome ? `com ${especialidadeNome}` : ""
    } ${profissionalNome ? `- ${profissionalNome}` : ""}`;

    setEditedEvent((prev) => ({ ...prev, titulo_agenda: generatedTitle }));
  }, [
    editedEvent.id_procedimento,
    editedEvent.profissional?.especialidade?.cod_especialidade,
    editedEvent.id_profissional,
    editedEvent.profissional,
    editedEvent.procedimento,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleColorChange = (e) => {
    setEditedEvent({ ...editedEvent, cor: e.target.value });
  };

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    if (isNaN(startDate.getTime())) {
      toastify.error("Data de início inválida.");
      return;
    }
    setEditedEvent({ ...editedEvent, data_inicio: startDate });
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    if (isNaN(endDate.getTime())) {
      toastify.error("Data de término inválida.");
      return;
    }
    setEditedEvent({ ...editedEvent, data_fim: endDate });
  };

  const handleCheckboxChange = () => {
    setEditedEvent({ ...editedEvent, transporte: !editedEvent.transporte });
  };

  const handleSelectChange = (e) => {
    const value = e.currentTarget.value;
    const selectedProfissional = profissionais.find(
      (prof) => prof.id_profissional === parseInt(value)
    );
    setEditedEvent((prev) => ({
      ...prev,
      id_profissional: value,
      profissional: selectedProfissional,
    }));
  };

  const confirmDelete = () => {
    confirmDialog({
      message: "Você deseja apagar esse evento?",
      header: "Confirmação para apagar",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
      acceptLabel: "Sim",
      rejectLabel: "Não",
    });
  };

  const reject = () => {
    toastify.info("O evento não foi apagado!");
  };

  const accept = () => {
    fetch(`http://localhost:3003/sistema/agenda/${editedEvent.id_agenda}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          onDelete(editedEvent.id_agenda);
          toastify.success("Evento apagado com sucesso!");
        } else {
          throw new Error("Falha ao deletar o evento");
        }
      })
      .catch((error) => {
        toastify.error("Erro ao apagar evento.");
      });
  };

  const handleUpdate = () => {
    const trimmedEvent = {
      ...editedEvent,
      titulo_agenda: editedEvent.titulo_agenda.trim(),
      descricao_complementar: editedEvent.descricao_complementar.trim(),
    };

    if (
      trimmedEvent.titulo_agenda &&
      trimmedEvent.data_inicio &&
      trimmedEvent.data_fim
    ) {
      const startDate = new Date(trimmedEvent.data_inicio);
      const endDate = new Date(trimmedEvent.data_fim);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        toastify.error("A data de início deve ser posterior ou igual a hoje.");
        return;
      }

      if (startDate >= endDate) {
        toastify.error("A data de início deve ser anterior à data final.");
        return;
      }

      if (
        startDate.getFullYear() > atualYear + 20 ||
        endDate.getFullYear() > atualYear + 20
      ) {
        toastify.error("As datas não podem ultrapassar o limite de 20 anos.");
        return;
      }

      fetch(`http://localhost:3003/sistema/agenda/${editedEvent.id_agenda}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo_agenda: trimmedEvent.titulo_agenda,
          data_inicio: startDate,
          data_fim: endDate,
          descricao_complementar: trimmedEvent.descricao_complementar,
          cor: trimmedEvent.cor,
          id_procedimento: trimmedEvent.id_procedimento,
          id_profissional: trimmedEvent.id_profissional,
          transporte: trimmedEvent.transporte,
          situacao: trimmedEvent.situacao,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.text().then((text) => {
              return text ? JSON.parse(text) : {}; // Verifique se o texto não está vazio antes de analisar
            });
          }
          throw new Error("Falha ao atualizar o evento");
        })
        .then((data) => {
          onUpdate({
            ...trimmedEvent,
            data_inicio: startDate,
            data_fim: endDate,
          });
          onClose();
          toastify.success("Evento atualizado com sucesso!");
        })
        .catch((error) => {
          toastify.error("Erro ao atualizar evento.");
        });
    }
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const adjustDate = (date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() - 4);
    return adjustedDate.toISOString().slice(0, -8);
  };

  const getMaxDateTimeLocal = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 20);
    maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());
    return maxDate.toISOString().slice(0, 16);
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Modal show={true} onHide={onClose}>
        <Modal.Header>
          <Modal.Title style={{ wordWrap: "break-word" }}>
            {editedEvent.titulo_agenda}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={6}>
                <Form.Label>Especialidade</Form.Label>
                <Form.Select
                  aria-label="especialidade"
                  value={
                    editedEvent.procedimento?.especialidade?.cod_especialidade
                  }
                  disabled
                >
                  {especialidades.map((especialidade) => (
                    <option
                      key={especialidade.cod_especialidade}
                      value={especialidade.cod_especialidade}
                    >
                      {especialidade.nome_especialidade}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={6}>
                <Form.Label>Procedimento</Form.Label>
                <Form.Select
                  aria-label="procedimento"
                  value={editedEvent.id_procedimento}
                  disabled
                >
                  {procedimentos.map((procedimento) => (
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

            <Row style={{ marginTop: "10px" }}>
              <Col xs={12}>
                <Form.Label>Profissional Responsável</Form.Label>
                <Form.Select
                  aria-label="profissional"
                  value={editedEvent.id_profissional}
                  onChange={handleSelectChange}
                >
                  {profissionais.map((profissional) => (
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

            <Form.Group controlId="formDesc">
              <Form.Label style={{ marginTop: "5px" }}>
                Descrição Complementar
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descricao_complementar"
                value={editedEvent.descricao_complementar}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Collapse in={!collapsed}>
              <div>
                <Form.Group controlId="formStart">
                  <Form.Label style={{ marginTop: "5px" }}>Início</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="data_inicio"
                    value={adjustDate(editedEvent.data_inicio)}
                    onChange={handleStartDateChange}
                    min={getCurrentDateTimeLocal()}
                    max={getMaxDateTimeLocal()}
                  />
                </Form.Group>

                <Form.Group controlId="formEnd">
                  <Form.Label style={{ marginTop: "5px" }}>Término</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="data_fim"
                    value={adjustDate(editedEvent.data_fim)}
                    onChange={handleEndDateChange}
                    min={getCurrentDateTimeLocal()}
                    max={getMaxDateTimeLocal()}
                  />
                </Form.Group>

                <Row>
                  <Col xs={6}>
                    <Form.Label style={{ marginTop: "20px" }}>
                      Precisa de transporte?
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
                      name="transporte"
                      label={"Sim, precisa."}
                      checked={editedEvent.transporte}
                      onChange={handleCheckboxChange}
                    />
                  </Col>

                  <Col xs={6} style={{ paddingLeft: "130px" }}>
                    <Form.Label
                      style={{ marginTop: "20px", marginLeft: "8px" }}
                    >
                      Cor
                    </Form.Label>
                    <Form.Control
                      type="color"
                      name="cor"
                      value={editedEvent.cor || "#000000"}
                      onChange={handleColorChange}
                    />
                  </Col>
                </Row>
                <Col xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <p style={{ margin: "0px" }}>Situação:&nbsp;</p>
                    {editedEvent.situacao === false && (
                      <p style={{ margin: "0px" }}>
                        Pendente{" "}
                        <FaClock
                          style={{ margin: "0px 2px 2px", color: "#ffb300" }}
                        />
                      </p>
                    )}
                    {editedEvent.situacao === true && (
                      <p style={{ margin: "0px" }}>
                        Aprovada{" "}
                        <FaCheck
                          style={{
                            margin: "0px 2px 2px",
                            color: "#008000",
                          }}
                        />
                      </p>
                    )}
                  </div>
                </Col>
              </div>
            </Collapse>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={() => setCollapsed(!collapsed)}>
            {!collapsed ? "Ocultar Detalhes" : "Mostrar Detalhes"}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Apagar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventModal;

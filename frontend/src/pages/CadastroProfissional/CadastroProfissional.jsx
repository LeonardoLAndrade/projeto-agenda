import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./CadastroProfissional.css";

const CadastroProfissional = () => {
  const [nextProfId, setNextProfId] = useState("");
  const [supervisores, setSupervisores] = useState([{}]);
  const [novoProfissional, setNovoProfissional] = useState({
    nome_prof: "",
    tipo_prof: 0,
    sup_prof: 0,
    status_prof: 0,
    cons_prof: "",
    senha_prof: "",
  });

  useEffect(() => {
    fetch("http://localhost:3003/sistema/profissionais/nextId")
      .then((response) => response.json())
      .then((data) => {
        setNextProfId(data.nextId || "");
      })
      .catch((error) =>
        toast.error("Erro ao buscar o próximo ID de profissional.")
      );
  }, [novoProfissional]);

  useEffect(() => {
    fetch("http://localhost:3003/sistema/profissionais/supervisores")
      .then((response) => response.json())
      .then((data) => {
        setSupervisores(data);
      })
      .catch((error) => toast.error("Erro ao buscar supervisores."));
  }, [novoProfissional]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoProfissional({ ...novoProfissional, [name]: value });
  };

  const handleSelectChange = (e) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    setNovoProfissional({ ...novoProfissional, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      novoProfissional.nome_prof &&
      novoProfissional.tipo_prof &&
      novoProfissional.status_prof &&
      novoProfissional.cons_prof &&
      novoProfissional.senha_prof
    ) {
      novoProfissional.nome_prof = novoProfissional.nome_prof.trim();
      novoProfissional.cons_prof = novoProfissional.cons_prof.trim();
      novoProfissional.senha_prof = novoProfissional.senha_prof.trim();
      if (
        novoProfissional.nome_prof.length >= 5 &&
        novoProfissional.nome_prof.length <= 100 &&
        novoProfissional.cons_prof.length >= 4 &&
        novoProfissional.cons_prof.length <= 10
      ) {
        if (
          novoProfissional.senha_prof.length >= 8 &&
          novoProfissional.senha_prof.length <= 12
        ) {
          if (
            novoProfissional.sup_prof === "" ||
            novoProfissional.sup_prof === 0
          ) {
            novoProfissional.sup_prof = undefined;
          }
          fetch("http://localhost:3003/sistema/cadastro_profissional", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(novoProfissional),
          })
            .then((response) => {
              if (response.ok) {
                toast.success("Profissional cadastrado com sucesso!");
                return response.json();
              } else {
                toast.error("Erro ao cadastrar profissional.");
              }
            })
            .then((data) => {
              setNovoProfissional({
                nome_prof: "",
                tipo_prof: 0,
                sup_prof: 0,
                status_prof: 0,
                cons_prof: "",
                senha_prof: "",
              });
            })
            .catch((error) => {
              toast.error("Erro ao cadastrar profissional.");
            });
        } else {
          toast.error(
            `A senha deve possuir de 8 à 12 caracteres. Atual: ${novoProfissional.senha_prof.length}`
          );
        }
      } else if (
        novoProfissional.nome_prof.length < 5 ||
        novoProfissional.nome_prof.length > 100
      ) {
        toast.error(
          `O nome deve possuir de 5 à 100 caracteres. Atual: ${novoProfissional.nome_prof.length}`
        );
      } else if (
        novoProfissional.cons_prof.length < 4 ||
        novoProfissional.cons_prof.length > 10
      ) {
        toast.error(
          `O conselho do profissional deve possuir de 4 à 10 caracteres. Atual: ${novoProfissional.cons_prof.length}`
        );
      } else {
        toast.error(
          "Há algum erro no cadastro, verifique os campos novamente."
        );
      }
    }
  };
  return (
    <section className="cadastro-profissional-body">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <h1 className="text-center">Cadastro de Profissionais</h1>
      <div className="cadastro-profissional-form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="cod_prof">Cod. Profissional</label>
          <Input
            type="number"
            id="cod_prof"
            name="cod_prof"
            readonly={true}
            value={nextProfId}
          />
          <div className="cadastro-profissional-input-group">
            <label htmlFor="nome_prof">Nome do profissional</label>
            <Input
              type="text"
              id="nome_prof"
              name="nome_prof"
              value={novoProfissional.nome_prof}
              placeholder="Insira o nome do novo profissional"
              onChange={handleChange}
            />
          </div>
          <div className="cadastro-profissional-input-group">
            <label htmlFor="tipo_prof">Tipo interno</label>
            <select
              id="tipo_prof"
              name="tipo_prof"
              className="form-select"
              required
              onChange={handleSelectChange}
              value={novoProfissional.tipo_prof}
            >
              <option value="">Escolha...</option>
              <option value={1}>Administrativo</option>
              <option value={2}>Técnico Básico</option>
              <option value={3}>Técnico Supervisor</option>
            </select>
            <label htmlFor="sup_prof">Supervisor do profissional</label>
            <select
              id="sup_prof"
              name="sup_prof"
              className="form-select"
              required={novoProfissional.tipo_prof != 2 ? false : true}
              onChange={handleSelectChange}
              value={novoProfissional.sup_prof}
            >
              <option value="">Escolha...</option>
              {supervisores.map((supervisor, index) => (
                <option
                  key={supervisor.cod_prof || index}
                  value={supervisor.cod_prof}
                >
                  {supervisor.cod_prof} - {supervisor.nome_prof}
                </option>
              ))}
            </select>
          </div>
          <label htmlFor="cons_prof">Conselho do profissional</label>
          <Input
            type="text"
            id="cons_prof"
            name="cons_prof"
            value={novoProfissional.cons_prof}
            placeholder="Insira o conselho do novo profissional"
            onChange={handleChange}
          />
          <label htmlFor="status_prof">Situação</label>
          <select
            id="status_prof"
            name="status_prof"
            className="form-select"
            required
            onChange={handleSelectChange}
            value={novoProfissional.status_prof}
          >
            <option value="">Escolha...</option>
            <option value={1}>Ativo</option>
            <option value={2}>Inativo</option>
            <option value={3}>Suspenso</option>
          </select>
          <label htmlFor="senha_prof">Senha</label>
          <Input
            type="password"
            id="senha_prof"
            placeholder="Insira a senha"
            onChange={handleChange}
            name="senha_prof"
            value={novoProfissional.senha_prof}
          />
          <button type="submit" className="btn btn-primary mt-2">
            Cadastrar
          </button>
        </form>
      </div>
    </section>
  );
};

export default CadastroProfissional;

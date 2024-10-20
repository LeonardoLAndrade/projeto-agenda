const express = require("express");
const router = express.Router();
const AgendaController = require("../controllers/agendaController.js");
const dataController = require("../controllers/dataController.js");

router.post("/agenda", AgendaController.Insert);
router.get("/agenda", AgendaController.SearchAll);
router.get("/agenda/:id", AgendaController.SearchOne);
router.put("/agenda/:id", AgendaController.Update);
router.delete("/agenda/:id", AgendaController.Delete);

// Endpoints para obter dados
router.get("/especialidades", dataController.getEspecialidades);
router.get("/procedimentos", dataController.getProcedimentos);
router.get("/profissionais", dataController.getProfissionais);

module.exports = router;

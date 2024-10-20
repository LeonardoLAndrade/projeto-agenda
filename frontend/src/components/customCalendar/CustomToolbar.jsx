import { useState, useEffect } from "react";

const CustomToolbar = ({ label, onView, onNavigate, views, view }) => {
  const viewNames = {
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
  };

  const [itemText, setItemText] = useState(viewNames[view]);

  useEffect(() => {
    setItemText(viewNames[view]);
  }, [view]);

  const handleViewChange = (newView) => {
    onView(newView);
    setItemText(viewNames[newView]);
  };

  return (
    <div className="toolbar-container">
      <h1 className="mesAno">{label}</h1>

      <div className="dirTop">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {itemText}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {views.map((view, index) => (
              <div key={index}>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleViewChange(view)}
                  >
                    {viewNames[view]}
                  </button>
                </li>
                {index === 2 && <hr className="dropdown-divider"></hr>}
              </div>
            ))}
          </ul>
        </div>

        <div className="toolbar-navigation">
          <button
            className="btn btn-secondary btn-ls mr-2 border-0"
            onClick={() => onNavigate("TODAY")}
          >
            Hoje
          </button>
          <button
            className="btn btn-sm mr-2 text-secondary"
            id="btn-left"
            onClick={() => onNavigate("PREV")}
          >
            <i className="bi bi-caret-left"></i>
          </button>
          <button
            className="btn btn-sm mr-2 text-secondary"
            id="btn-right"
            onClick={() => onNavigate("NEXT")}
          >
            <i className="bi bi-caret-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;

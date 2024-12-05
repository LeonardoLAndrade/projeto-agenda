import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { Calendar as ReactCalendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "react-toastify";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

import EventModal from "../components/ModalEvent/EventModal";
import Add from "../components/add/Add";
import CustomToolbar from "../components/customCalendar/CustomToolbar";
import FiltroAtividades from "../components/filtro/FiltroAtividades";
import FiltroProcedimentos from "../components/filtro/FiltroProcedimentos";

const DragAndDropCalendar = withDragAndDrop(ReactCalendar);

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

function Calendar() {
  const [eventos, setEventos] = useState([]);
  const [eventSelected, setEventSelected] = useState(null);
  const [eventsFilter, setEventsFilter] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [agendaLength, setAgendaLength] = useState(0);
  const [eventChanged, setEventChanged] = useState(false);

  const loadEvents = () => {
    fetch("http://localhost:3003/sistema/agenda")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Erro ao buscar eventos");
      })
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.data_inicio),
          end: new Date(event.data_fim),
          title: event.titulo_agenda,
        }));
        setEventos(formattedEvents);
        setEventsFilter(formattedEvents);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erro ao buscar eventos");
      });
  };

  useEffect(() => {
    loadEvents();
  }, [eventChanged]);

  const messages = {
    allDay: "Dia todo",
    previous: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Nenhum evento neste intervalo.",
    showMore: (total) => `+ Ver mais (${total})`,
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
    agendaTimeFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
    dayFormat: (date, culture, localizer) => {
      const day = capitalizeFirstLetter(
        localizer.format(date, "dddd", culture).split("-")[0]
      );
      return `${localizer.format(date, "DD", culture)} - ${day}`;
    },
    monthHeaderFormat: (date, culture, localizer) => {
      const month = capitalizeFirstLetter(
        localizer.format(date, "MMMM", culture)
      );
      return `${month} de ${localizer.format(date, "YYYY", culture)}`;
    },
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      const startDay =
        localizer.format(start, "DD", culture).charAt(0).toUpperCase() +
        localizer.format(start, "DD", culture).slice(1);
      const endDay =
        localizer.format(end, "DD", culture).charAt(0).toUpperCase() +
        localizer.format(end, "DD", culture).slice(1);
      return `${startDay} - ${endDay} de ${localizer.format(
        end,
        "MMMM",
        culture
      )} de ${localizer.format(end, "YYYY", culture)}`;
    },
    dayHeaderFormat: (date, culture, localizer) => {
      const monthName = localizer.format(date, "MMMM", culture);
      const year = localizer.format(date, "YYYY", culture);
      return `${capitalizeFirstLetter(
        localizer.format(date, `dddd, DD`, culture)
      )}  de ${monthName} de ${year}`;
    },
    agendaDateFormat: (date, culture, localizer) =>
      localizer.format(date, "DD/MM", culture),
    agendaHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "DD", culture)} - ${localizer.format(
        end,
        "DD [de] MMMM [de] YYYY",
        culture
      )}`,
  };

  const eventStyle = (event) => ({
    style: {
      backgroundColor: event.cor,
    },
  });

  const moveEvents = (data) => {
    const { start, end } = data;
    const updatedEvents = eventos.map((event) => {
      if (event.id_agenda === data.event.id_agenda) {
        return {
          ...event,
          start: new Date(start),
          end: new Date(end),
        };
      }
      return event;
    });
    setEventos(updatedEvents);
    setEventChanged(!eventChanged);
  };

  const handleClickEvent = (event) => {
    setEventSelected(event);
  };

  const handleCloseEvent = () => {
    setEventSelected(null);
  };

  const handleAdd = (newEvent) => {
    setEventos([...eventos, { ...newEvent, id_agenda: eventos.length }]);
    setEventChanged(!eventChanged);
  };

  const handleEventDelete = (eventId) => {
    const updatedEvents = eventos.filter(
      (event) => event.id_agenda !== eventId
    );
    setEventos(updatedEvents);
    setEventSelected(null);
    setEventChanged(!eventChanged);
  };

  const handleEventUpdate = (updatedEvent) => {
    const updatedEvents = eventos.map((event) => {
      if (event.id_agenda === updatedEvent.id_agenda) {
        return updatedEvent;
      }
      return event;
    });
    setEventos(updatedEvents);
    setEventSelected(null);
    setEventChanged(!eventChanged);
  };

  const handleSelecionarAtividades = (atividadesSelecionadas) => {
    console.log(atividadesSelecionadas);
    setEventsFilter(atividadesSelecionadas);
  };

  const handleSelectSlot = ({ start }) => {
    setView("day");
    setDate(start);
  };

  const handleSelectView = (newView) => {
    if (newView === "agenda") {
      const startOfMonth = moment(date).startOf("month").toDate();
      const endOfMonth = moment(date).endOf("month").toDate();
      const length = moment(endOfMonth).diff(startOfMonth, "days");

      setAgendaLength(length);
      setDate(startOfMonth);
    }
    setView(newView);
  };

  const handleNavigate = (newDate) => {
    if (view === "agenda") {
      const currentMonth = moment(date).month();

      const endOfNewDate = moment(newDate)
        .subtract(1, "seconds")
        .add(1, "days")
        .toDate();

      const endOfDate = moment(date).endOf("month").toDate();

      if (endOfNewDate.toString() === endOfDate.toString()) {
        const newMonth = moment(endOfNewDate).add(1, "days");

        const startOfNewMonth = moment(newMonth).startOf("month").toDate();
        const endOfNewMonth = moment(newMonth).endOf("month").toDate();
        const length = moment(endOfNewMonth).diff(startOfNewMonth, "days");

        setAgendaLength(length);
        setDate(startOfNewMonth);
      } else if (currentMonth === 2) {
        const february = moment(newDate).add(1, "months");

        const startOfNewMonth = moment(february).startOf("month").toDate();
        const endOfNewMonth = moment(february).endOf("month").toDate();
        const length = moment(endOfNewMonth).diff(startOfNewMonth, "days");

        setAgendaLength(length);
        setDate(startOfNewMonth);
      } else {
        const startOfNewMonth = moment(newDate).startOf("month").toDate();
        const endOfNewMonth = moment(newDate).endOf("month").toDate();
        const length = moment(endOfNewMonth).diff(startOfNewMonth, "days");

        setAgendaLength(length);
        setDate(startOfNewMonth);
      }
    } else {
      setDate(newDate);
    }
  };

  return (
    <div className="tela">
      <div
        className="toolbar p-4"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <Add onAdd={handleAdd} />
        <FiltroAtividades
          atividades={eventos}
          selecionarAtividades={handleSelecionarAtividades}
        />
        <FiltroProcedimentos
          atividades={eventos}
          selecionarAtividades={handleSelecionarAtividades}
        />
      </div>

      <div className="calendario">
        <DragAndDropCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={eventsFilter}
          localizer={localizer}
          resizable
          onEventDrop={moveEvents}
          onEventResize={moveEvents}
          onSelectEvent={handleClickEvent}
          eventPropGetter={eventStyle}
          components={{
            toolbar: (props) => (
              <CustomToolbar {...props} view={view} onView={handleSelectView} />
            ),
          }}
          messages={messages}
          className="calendar"
          view={view}
          date={date}
          onView={setView}
          onNavigate={handleNavigate}
          onSelectSlot={handleSelectSlot}
          min={new Date(2024, 6, 25, 6, 0)} // 08:00
          max={new Date(2024, 6, 25, 19, 0)} // 18:00
          formats={formats}
          step={15}
          length={view === "agenda" ? agendaLength : undefined}
        />
        {eventSelected && (
          <div>
            <EventModal
              event={eventSelected}
              onClose={handleCloseEvent}
              onDelete={handleEventDelete}
              onUpdate={handleEventUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;

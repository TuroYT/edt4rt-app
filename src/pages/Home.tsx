import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "./Home.css";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid'


function convertirFormatDate(dateString: string) {
  const dateTimeParts = dateString.split(" ");
  const dateWithoutTimeZone = dateTimeParts[0] + "T" + dateTimeParts[1].split("+")[0];
  return dateWithoutTimeZone;
}

interface Event {
  title: string;
  start: string;
  end: string;
  id: string;
  description: string;
  extendedProps:any;
}

interface EventData {
  summary: string;
  start: string;
  end: string;
  description?: string;
  prof?: string;
  location: string;
  uid?: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);


  const eventRender = (event:Event) => {
    const location = event.extendedProps.location;
  }
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://api.romain-pinsolle.fr/api/planning/getPlanningPerName/but1_g3", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        
        const json = await response.json();
        console.log(json)
        const formattedEvents: Event[] = json.map((eventData: EventData) => ({
          title: eventData.summary + " - " + eventData.location + ((eventData.prof !== "NA" && " - " +eventData.prof) || ""),
          start: convertirFormatDate(eventData.start),
          end: convertirFormatDate(eventData.end),
          description: eventData.location,
          id: eventData.uid,
          color : ((eventData.prof !== "NA" && "default") || "#005049"),
          extendedProps:{
            location:eventData.location,
          }

        }));

        setEvents(formattedEvents);
      } catch (error) {
        // Handle any errors during fetching or parsing
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents(); // Initiate the data fetching
  }, []);

  return (
    <IonPage>
      {events.length ? (<>
        <IonHeader>
          <IonToolbar>
            <IonTitle>EDT 4 RT</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div id="main-content">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridDay"
              locale={"fr"}
              titleFormat={{ month: "long", day: "numeric" }}
              hiddenDays={[6,0]}
              events={events}
              allDaySlot={false}
              height="auto"
              slotMinTime="08:00"
              slotMaxTime="19:00"
            />
          </div>
        </IonContent></>
      ) : (
        // Display a loading indicator or placeholder while events are fetched
        <IonContent fullscreen>
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Home;

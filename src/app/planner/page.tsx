"use client"; 
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from '@/components/LoadingSpinner';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const PlannerPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState<string>(''); // Only date part
  const [formStartTime, setFormStartTime] = useState<string>(''); // Only time part
  const [formEndTime, setFormEndTime] = useState<string>(''); // Only time part

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/getGCal');
        const data = await response.json();
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setCurrentEvent(null);
    setFormTitle('');
    setFormDate(moment(start).format('YYYY-MM-DD'));
    setFormStartTime(moment(start).format('HH:mm'));
    setFormEndTime(moment(end).format('HH:mm'));
    setShowModal(true);
  };

  const handleSelectEvent = (event: Event) => {
    setCurrentEvent(event);
    setFormTitle(event.title);
    setFormDate(moment(event.start).format('YYYY-MM-DD'));
    setFormStartTime(moment(event.start).format('HH:mm'));
    setFormEndTime(moment(event.end).format('HH:mm'));
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    if (formTitle && formDate && formStartTime && formEndTime) {
      const newEvent = {
        title: formTitle,
        start: new Date(`${formDate}T${formStartTime}`).toISOString(),
        end: new Date(`${formDate}T${formEndTime}`).toISOString(),
      };

      try {
        const response = await fetch('/api/getGCal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });

        const savedEvent = await response.json();
        setEvents([...events, { ...savedEvent, start: new Date(savedEvent.start), end: new Date(savedEvent.end) }]);
        setShowModal(false);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleUpdateEvent = async () => {
    if (currentEvent && formTitle && formDate && formStartTime && formEndTime) {
      const updatedEvent = {
        id: currentEvent.id,
        title: formTitle,
        start: new Date(`${formDate}T${formStartTime}`).toISOString(),
        end: new Date(`${formDate}T${formEndTime}`).toISOString(),
      };

      try {
        const response = await fetch('/api/getGCal', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEvent),
        });

        const savedEvent = await response.json();
        const updatedEvents = events.map(event => (event.id === currentEvent.id ? { ...savedEvent, start: new Date(savedEvent.start), end: new Date(savedEvent.end) } : event));
        setEvents(updatedEvents);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (currentEvent) {
      try {
        await fetch('/api/getGCal', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: currentEvent.id }),
        });

        const updatedEvents = events.filter(event => event.id !== currentEvent.id);
        setEvents(updatedEvents);
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const eventStyleGetter = (event: Event) => {
    const backgroundColor = '#3174ad';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <h2>My Planner</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEvent ? 'Update Event' : 'Add Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {currentEvent ? (
            <>
              <Button variant="primary" onClick={handleUpdateEvent}>
                Update Event
              </Button>
              <Button variant="danger" onClick={handleDeleteEvent}>
                Delete Event
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleAddEvent}>
              Add Event
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlannerPage;

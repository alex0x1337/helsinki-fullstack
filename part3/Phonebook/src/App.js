import { useState, useEffect } from 'react'
import records from './services/records'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonsForm from './components/PersonsForm'
import Persons from './components/Persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState({});

  useEffect(() => {
    records
      .getAll()
      .then(data => {
        setPersons(data);
      });
  }, [])

  const notify = (message, success) => {
    setNotification({ success: success, message: message });
    setTimeout(() => {
      setNotification({});
    }, 5000)
  };

  const addName = (event) => {
    event.preventDefault();
    let person = persons.find(person => person.name === newName);
    if(!person) {
      let newPerson = {name : newName, number: newNumber };
      records
        .create(newPerson)
        .then(data => {
          setNewName('');
          setNewNumber('');
          setPersons(persons.concat(data));
          notify(`Added ${newPerson.name}`, true);
        })
        .catch(error => {
          if(error.response.data.error) {
            notify(error.response.data.error);
          }
        })
    } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
      let newPerson = { ...person, name : newName, number: newNumber };
      records
        .update(newPerson)
        .then(data => {
          setNewName('');
          setNewNumber('');
          setPersons(persons.map(person => person.id !== newPerson.id ? person : data));
          notify(`Updated ${newPerson.name}`, true);
        })
        .catch((error) => {
          if(error.response.data.error) {
            notify(error.response.data.error);
          } else if (error.response.status === 404) {
            setPersons(persons.filter((person) => person.id !== newPerson.id));
            notify(`Information of ${newPerson.name} has already been removed from the server`);
          }
        });
    }
  }

  const onNameChange = (event) => setNewName(event.target.value);
  const onNumberChange = (event) => setNewNumber(event.target.value);
  const onFilterChange = (event) => setNewFilter(event.target.value);
  const onDelete = (event, id) => {
    event.preventDefault();
    let person = persons.find(person => person.id === id);
    if (window.confirm(`Do you really want to delete record ${person.name}`)) {
      records.delete(id)
        .then((data) => {
          setPersons(persons.filter((person) => person.id !== id));
          notify(`Deleted ${person.name}`, true);
        })
    }
  };

  const filteredPersons = persons.filter(person => person.name.indexOf(newFilter) !== -1);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} success={notification.success} />
      <Filter filter={newFilter} onFilterChange={onFilterChange} />
      <h2>add a new</h2>
      <PersonsForm name={newName} number={newNumber} onClick={addName} onNameChange={onNameChange} onNumberChange={onNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={onDelete} />
    </div>
  )
}

export default App

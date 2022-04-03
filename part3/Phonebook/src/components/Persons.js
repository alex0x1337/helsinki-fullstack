const Person = ({id, name, number, onDelete}) => (
    <div>{name} {number}
      <form style={{display: "inline"}}>
        <button type="submit" onClick={(event) => onDelete(event, id)}>delete</button>
      </form>
    </div>
    );

const Persons = (props) => props.persons.map(({name, number, id}) => <Person id={id} key={id} name={name} number={number} onDelete={props.onDelete} />);

export default Persons;

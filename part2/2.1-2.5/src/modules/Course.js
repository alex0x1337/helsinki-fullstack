
const Header = (props) => {
        return <h1>{props.course.name}</h1>;
    };
  
const Part = (props) => {
        return (
        <p>
        {props.part} {props.exercises}
        </p>);
    };
const Content = (props) => {
    return <div>
        {props.course.parts.map((part) => <Part part={part.name} key={part.id} exercises={part.exercises} />)}
        </div>;
    };

const Total = (props) => {
        return <p><b>Total of {props.course.parts.reduce((sum, value) => sum+value.exercises, 0)} exercises</b></p>;
    };

const Course = (props) => {
    return (
        <div>
            <Header course={props.course} />
            <Content course={props.course} />
            <Total course={props.course} />
        </div>
        );
    };

export default Course;

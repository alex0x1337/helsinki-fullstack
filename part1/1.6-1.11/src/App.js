import { useState } from 'react'


const Header = ({text}) => <h1>{text}</h1>;

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const StatisticsLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
  );
const Statistics = ({bad, good, neutral}) => {
  return (
    <table>
      <tbody>
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="all" value={good+neutral+bad} />
      <StatisticsLine text="average" value={ (good-bad) / (good+neutral+bad) } />
      <StatisticsLine text="positive" value={ (good*100 / (good+neutral+bad)) + "%" } />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);
  if (good+neutral+bad !== 0) {
    return (
      <div>
        <Header text="give feedback" />
        <Button onClick={incrementGood} text="good" />
        <Button onClick={incrementNeutral} text="neutral" />
        <Button onClick={incrementBad} text="bad" />
        <Header text="statistics" />
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    );
  } else {
    return (
      <div>
        <Header text="give feedback" />
        <Button onClick={incrementGood} text="good" />
        <Button onClick={incrementNeutral} text="neutral" />
        <Button onClick={incrementBad} text="bad" />
        <Header text="statistics" />
        <div>No feedback given</div>
      </div>
    );
  }
};

export default App;


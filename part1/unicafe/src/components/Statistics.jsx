import StatisticLine from './StatisticLine'

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad
    const score = good - bad
    
    return (
        total === 0 ?
        <div>No feedback given</div> :
        <table>
            <tbody>
                <StatisticLine value={good}>good</StatisticLine>
                <StatisticLine value={neutral}>neutral</StatisticLine>
                <StatisticLine value={bad}>bad</StatisticLine>
                <StatisticLine value={total}>all</StatisticLine>
                <StatisticLine value={score / total}>average</StatisticLine>
                <StatisticLine value={100 * good / total + " %"}>positive</StatisticLine>
            </tbody>
        </table>
    )
}

export default Statistics
const Total = ({ content }) => {
    const total = content.reduce((sum, part) => sum + part.exercises, 0)
    
    return <p>Number of exercises {total}</p>
}

export default Total
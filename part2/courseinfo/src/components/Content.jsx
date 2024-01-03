import Part from './Part'

const Content = ({ parts }) => {
    return (
        <>
            {
                parts.map((e, i) => <Part key={i} e={e}/>)
            } 
        </>
    )
}

export default Content
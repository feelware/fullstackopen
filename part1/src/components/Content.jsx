import Part from './Part'

const Content = ({ content }) => {
    return (
        <>
            {
                content.map((e, i) => <Part key={i} e={e}/>)
            } 
        </>
    )
}

export default Content
const Content = ({ content }) => {
    return (
        <>
            {
                content.map((e, i) => <p key={i}>
                    {e.part} {e.exercises}
                </p>)
            } 
        </>
    )
}

export default Content
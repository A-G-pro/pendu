import React from 'react'

const wrongsuggestion = (wrongSuggestion: number) => {
    return (
        <>
            <p>Nombre d'erreurs : {wrongSuggestion}</p>
            {
                wrongSuggestion == 11 && (
                    <p>Vous avez fait {wrongSuggestion} mauvaises propositions.... Dommage !</p>
                )
            }
        </>
    )
}

export default wrongsuggestion
"use client"
import {
    useEffect, useState, useRef
} from 'react'
import Link from 'next/link'
import axios from 'axios'


const game: React.FC = () => {

    const api_url = `https://trouve-mot.fr/api/random`

    const drawPendu = useRef(null)
    const [word, setWord] = useState<string>("")
    const [splitWord, setSplitWord] = useState<string[]>([])
    const [wordLength, setWordLength] = useState(0)

    const [inputValue, setInputValue] = useState<string>('');
    const [playerSuggestion, setPlayerSuggestion] = useState<string>('');
    const [foundedLetters, setFoundedLetters] = useState<string[]>([])
    const [wrongSuggestion, setWrongSuggestion] = useState<number>(0)
    const [wordAnswer, setWordAnswer] = useState<string[]>([])

    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmited, setIsSubmited] = useState<boolean>(false)
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const initWord = async () => {
        try {
            const resp = await axios.get(api_url)
            setWord(resp.data[0].name)
            setWordLength(resp.data[0].name.length)
            setSplitWord([...resp.data[0].name])
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const initNewGame = () => {
        setLoading(true)
        initWord()
        setIsSubmited(false)
        setIsFinished(false)
        setWordAnswer([])
        setFoundedLetters([])
        setWrongSuggestion(0)

    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            setPlayerSuggestion(inputValue)
            setIsSubmited(true)
            setInputValue('')
        }
    };

    const verifySuggestion = (letter: string) => {
        if (splitWord.includes(letter) && !foundedLetters.includes(letter)) {
            setFoundedLetters([...foundedLetters, letter])
            updateAnswerDisplay(splitWord, letter)
        } else if (foundedLetters.includes(letter)) {
            alert('Vous avez déjà trouvé cette lettre')
        } else {
            setWrongSuggestion(wrongSuggestion + 1)
        }
    }

    const updateAnswerDisplay = (wordToFind: string[], letter: string) => {
        // get letter position(s)
        var positions = []
        var idx = wordToFind.indexOf(letter);
        while (idx != -1) {
            positions.push(idx);
            idx = wordToFind.indexOf(letter, idx + 1);
        }

        // built answer array
        var playerWordAnswer = [...wordAnswer]
        for (let index = 0; index < wordLength; index++) {
            if (positions.includes(index)) {
                playerWordAnswer[index] = letter
            } else if (playerWordAnswer[index] == undefined) {
                playerWordAnswer[index] = '_'
            }
        }
        setWordAnswer(playerWordAnswer)
    }

    useEffect(() => {
        if (splitWord.length > 0 && wordAnswer.toString() === splitWord.toString()) {
            setIsFinished(true)
        }
    }, [wordAnswer])

    const addPart = (step: number) => {

    }
    useEffect(() => {

        draw(wrongSuggestion)

        if (wrongSuggestion == 11) {
            setIsFinished(true)
        }
    }, [wrongSuggestion])

    useEffect(() => {
        if (playerSuggestion.length == 1) {
            verifySuggestion(playerSuggestion)
        } else if (playerSuggestion.length > 1) {
            alert('Vous ne devez proposer qu\'une lettre avant d\'appuyer sur \'Enter\' !')
        } else if (isSubmited && playerSuggestion == '') {
            alert('Vous devez proposer une lettre avant d\'appuyer sur \'Enter\' !')
        }
    }, [playerSuggestion])


    useEffect(() => {
        console.log('Render initWord')
        initWord()
    }, [])

    const draw = (step: number) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        
        if (canvas.getContext) {
            const ctx = canvas.getContext("2d");

            if (ctx != null) {
                ctx.beginPath();

                switch (step) {
                    case 1:
                        ctx.moveTo(40, 90)
                        ctx.lineTo(60, 90)
                        ctx.stroke();
                        break;

                    case 2:
                        ctx.moveTo(50, 90)
                        ctx.lineTo(50, 10)
                        ctx.stroke();
                        break;

                    case 3:
                        ctx.moveTo(50, 10)
                        ctx.lineTo(70, 10)
                        ctx.stroke();
                        break;

                    case 4:
                        ctx.moveTo(60, 10)
                        ctx.lineTo(50, 23)
                        ctx.stroke();
                        break;

                    case 5:
                        ctx.moveTo(70, 10)
                        ctx.lineTo(70, 20)
                        ctx.stroke();
                        break;

                    case 6:
                        ctx.moveTo(70, 30)
                        ctx.arc(70, 30, 10, 0, Math.PI * 2, true);
                        ctx.fill()
                        break;

                    case 7:
                        ctx.moveTo(70, 40)
                        ctx.lineTo(70, 60)
                        ctx.stroke();
                        break;

                    case 8:
                        ctx.moveTo(70, 60)
                        ctx.lineTo(60, 80)
                        ctx.stroke();
                        break;

                    case 9:
                        ctx.moveTo(70, 60)
                        ctx.lineTo(80, 80)
                        ctx.stroke();
                        break;

                    case 10:
                        ctx.moveTo(70, 45)
                        ctx.lineTo(60, 60)
                        ctx.stroke();
                        break;

                    case 11:
                        ctx.moveTo(70, 45)
                        ctx.lineTo(80, 60)
                        ctx.stroke();
                        break;

                    default:
                        break;
                }

                ctx.closePath()
            }
        }
    }

    return (
        <>
            <h1>Le pendu</h1>
            <canvas id="canvas" width="100" height="100">

            </canvas>
            {wrongSuggestion == 11 && (
                <p>Perdu.... Dommage !</p>
            )}
            {isFinished && (
                <>
                    <div>Partie terminée</div>
                    <Link href={'/'}>Accueil</Link>
                    <Link href={'/game'} onClick={() => initNewGame()}>Rejouer</Link>
                </>
            )}
            {loading && (
                <p>Chargement en cours...</p>
            )}
            {!isFinished && !loading && (
                <div>
                    <div>
                        {splitWord.length > 0 && wordAnswer.length == 0 &&
                            splitWord.map((item, index) => (
                                <span key={index}> _ </span>
                            ))}
                        {wordAnswer && wordAnswer.length > 0 &&
                            wordAnswer.map((item, index) => (
                                <span key={index}> {item} </span>
                            ))}
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        maxLength={1}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyUp={handleKeyUp}
                    />
                    <div>
                        <Link href={'/'}>Retour</Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default game
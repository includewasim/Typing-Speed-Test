import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const paragraph = `The art of typing is not just about speed but also about accuracy. Typing efficiently can greatly enhance productivity, whether you are composing emails, writing reports, or coding. To improve your typing skills, it is essential to maintain proper posture, use all your fingers correctly, and practice regularly. Start by familiarizing yourself with the keyboard layout and practicing common words and phrases. Gradually increase your typing speed while ensuring that you are not making too many errors. With consistent effort and practice, you will find yourself typing faster and more accurately. Typing tests and games can also be useful tools to help improve your skills while making the learning process enjoyable and engaging.`;

function TypingTest() {

    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [mistakes, setMistakes] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const charRefs = useRef([]);
    const inputRef = useRef(null);
    const [correctWrong, setCorrectWrong] = useState([]);

    useEffect(() => {
        inputRef.current.focus();
        setCorrectWrong(Array(paragraph.length).fill(''));
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft > 0) {
                        return prevTimeLeft - 1;
                    } else {
                        clearInterval(interval);
                        setIsTyping(false);
                        return prevTimeLeft;
                    }
                });
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft]);

    useEffect(() => {
        if (timeLeft < maxTime && timeLeft > 0) {
            const correctChars = charIndex - mistakes;
            const totalTime = maxTime - timeLeft;

            let cpm = correctChars * (60 / totalTime);
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));

            let wpm = Math.round((correctChars / 5) / (totalTime / 60));
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);
        }
    }, [charIndex, mistakes, timeLeft]);

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCPM(0);
        setWPM(0);
        setMistakes(0);
        setCharIndex(0);
        setCorrectWrong(Array(paragraph.length).fill(''));
        inputRef.current.value = '';
        inputRef.current.focus();
    };

    const handleChange = (e) => {
        const characters = charRefs.current;
        const currentChar = charRefs.current[charIndex];
        let typedChar = e.target.value.slice(-1);

        if (charIndex < characters.length && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true);
            }
            const updatedCorrectWrong = [...correctWrong];
            if (typedChar === currentChar.textContent) {
                updatedCorrectWrong[charIndex] = 'correct';
                setCharIndex(charIndex + 1);
            } else {
                updatedCorrectWrong[charIndex] = 'wrong';
                setMistakes(mistakes + 1);
                setCharIndex(charIndex + 1);
            }
            setCorrectWrong(updatedCorrectWrong);
            if (charIndex === characters.length - 1) setIsTyping(false);
        }
    };

    return (
        <>
        <header>
        <h1><strong>Speed</strong> Test</h1>
        </header>
        <div className='container'>
            <div className='test'>
                <input type='text' className='input-field' ref={inputRef} onChange={handleChange} />
                <div className='paragraph'>
                    {paragraph.split("").map((char, index) => (
                        <span
                            key={index}
                            className={`char ${index === charIndex ? "active" : ""} ${correctWrong[index]}`}
                            ref={(el) => (charRefs.current[index] = el)}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>

            <div className="result">
                <p>Time Left: <strong>{timeLeft}</strong></p>
                <p>Mistakes: <strong>{mistakes}</strong></p>
                <p>WPM: <strong>{WPM}</strong></p>
                <p>CPM: <strong>{CPM}</strong></p>
                <button className='btn' onClick={resetGame}>Try Again</button>
            </div>
        </div>
        <footer>
            <span>Copyrights reserved © Wasim Khan</span>
        </footer>
        </>
    );
}


export default TypingTest;

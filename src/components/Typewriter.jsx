import React, { useState, useEffect } from 'react';

const Typewriter = ({ texts, speed = 150, eraseSpeed = 100, delay = 1000 }) => {
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (index === texts.length) return;

        if (isDeleting) {
        if (subIndex === 0) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % texts.length);
        } else {
            setTimeout(() => {
            setSubIndex((prev) => prev - 1);
            setText(texts[index].substring(0, subIndex - 1));
            }, eraseSpeed);
        }
        } else {
        if (subIndex === texts[index].length) {
            setTimeout(() => setIsDeleting(true), delay);
        } else {
            setTimeout(() => {
            setSubIndex((prev) => prev + 1);
            setText(texts[index].substring(0, subIndex + 1));
            }, speed);
        }
        }
    }, [subIndex, isDeleting, index, texts, speed, eraseSpeed, delay]);

    return <h1 className="title text-4xl font-bold mt-2">{text}</h1>;
};

export default Typewriter;
